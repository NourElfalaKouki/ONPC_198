

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const usersRoutes = require('./routes/users');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:5074",
      "http://localhost:8081",
      "exp://192.168.1.101:8081",
      "http://192.168.1.101:8081",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

// Configure multer storage for uploads
const uploadDir = path.join(__dirname, 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(cors());
app.use('/users', (req, res, next) => {
  if (req.body?.mdp) {
    console.log(`🛂 [Login] request body: { email: '${req.body.email}', mdp: '[HIDDEN]' }`);
  }
  next();
}, usersRoutes);
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/', (req, res) => res.send('Server is running.'));
app.get('/socket-info', (req, res) => {
  res.send(`Le serveur Socket.IO est accessible à l'adresse localhost:${PORT}`);
});

// Upload routes
app.post('/upload', upload.single('image'), (req, res) => {
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).send(imageUrl);
});
app.post('/uploadAudio', upload.single('audio'), (req, res) => {
  if (!req.file) return res.status(400).send("Aucun fichier audio n'a été téléchargé.");
  const audioUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).send(audioUrl);
});

// WebSocket event handling
let pendingMessages = [];
let connectedMobileClient = null;
let webClientConnected = null;

function handleConnection(socket) {
  socket.on('register', (role) => {
    if (role === 'web') {
      if (!webClientConnected) {
        webClientConnected = socket.id;
        console.log('Client Web connecté :', socket.id);
      } else {
        socket.emit('connectionRejected', 'Un client Web est déjà connecté.');
        socket.disconnect(true);
      }
    } else if (role === 'mobile') {
      if (!connectedMobileClient) {
        connectedMobileClient = socket.id;
        console.log('Client Mobile connecté :', socket.id);
        if (webClientConnected) {
          io.to(webClientConnected).emit('mobileConnected', { mobileId: socket.id });
        }
      } else {
        socket.emit('connectionRejected', 'Un client mobile est déjà connecté au client Web.');
        socket.disconnect(true);
      }
    }
  });

  socket.on('disconnect', () => {
    if (socket.id === connectedMobileClient) {
      console.log('Client Mobile déconnecté :', socket.id);
      connectedMobileClient = null;
      if (webClientConnected) {
        io.to(webClientConnected).emit('mobileDisconnected');
      }
    }
    if (socket.id === webClientConnected) {
      console.log('Client Web déconnecté :', socket.id);
      webClientConnected = null;
    }
  });

  socket.on('sendFirstMessage', (message) => {
    pendingMessages.push(message);
    console.log(message);
    if (webClientConnected) {
      pendingMessages.forEach(msg => io.to(webClientConnected).emit('sendMessageToWeb', msg));
      pendingMessages = [];
    }
  });

  socket.on('sendImageData', (imageData) => {
    try {
      console.log('Image data received:', imageData);
      io.emit('sendImageToWeb', imageData);
      socket.emit('imageDataReceived', { success: true });
    } catch (error) {
      console.error('Error processing image data:', error);
      socket.emit('imageDataReceived', { success: false, error: 'Error processing image data' });
    }
  });

  socket.on('sendAudioData', (audioData) => {
    try {
      console.log('Audio data received:', audioData);
      io.emit('sendAudioToWeb', audioData);
      socket.emit('AudioDataReceived', { success: true });
    } catch (error) {
      console.error('Error processing audio data:', error);
      socket.emit('AudioDataReceived', { success: false, error: 'Error processing audio data' });
    }
  });

  socket.on('message', (message) => {
    console.log('Message received from client:', message);
    io.emit('sendMessageToMobile', message);
  });

  socket.on('offer', (offerData) => {
    const { userId, offer } = offerData;
    io.emit('offer', { userId, offer });
    console.log('Offer received and emitted:', offerData);
  });
}

io.removeAllListeners('connection');
io.on('connection', handleConnection);

app.post('/notifyNewMessage', (req, res) => {
  const { userId } = req.body;
  io.emit('newMessageAlert', userId);
  res.sendStatus(200);
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
