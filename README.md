# Project 198

Project 198 is a full-stack solution consisting of:
- A **mobile app** (React Native) for real-time user location tracking, audio calls, and instant messaging.(revamped)
- A **backend** (Node.js) to manage user data and real-time communication via Socket.IO.(revamped)
- A **web interface** (ASP.NET Core MVC) with Leaflet maps and WebSocket-based real-time messaging. (getting revamped)

![Project Architecture](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![ASP.NET](https://img.shields.io/badge/ASP.NET_Core-512BD4?style=for-the-badge&logo=.net&logoColor=white)

## Features
- Real-time user location tracking.
- Audio call functionality(Getting implemented).
- Instant messaging with WebSocket/Socket.IO.
- Web-based dashboard for monitoring interactions.
- Email verification and password reset workflows.

## Technologies
- **Frontend (Mobile)**: React Native, Expo
- **Backend**: Node.js, Express.js, Socket.IO
- **Web Interface**: ASP.NET Core MVC, Leaflet.js
- **Database**: MySQL

---

## Prerequisites

### Mobile App (Frontend)
- Node.js (v16+)
- Expo CLI: Install globally with `npm install -g expo-cli`
- React Native dependencies

### Backend (Node.js)
- Node.js and npm
- MySQL server (local or remote)
- Socket.IO

### Web Interface
- .NET SDK
- MySQL Server

---

## Installation

### 1. Frontend (Mobile App)
1. Clone the repository:  
   `git clone https://github.com/ARTIRL/198`
2. Install dependencies:  
   `npm install`
3. Make sure to configure the right IP Address of the sever : on `config.js`   
4. Start the app:  
   `npx expo start` 

### 2. Backend (Node.js)
1. Navigate to the backend folder.
2. Install dependencies:  
   `npm install`
3. Configure `config.js` with your MySQL credentials and ports.
4. Start the server:  
   `node server.js`

### 3. Web Interface (ASP.NET Core)
1. Build the project:  
   `dotnet build`
2. Run the application:  
   `dotnet run`  
   (Use F5 in Visual Studio/Code for debugging.)

---

## Database Setup

1. Create a MySQL database named `user_db`.
2. Run the following SQL queries:

```sql
-- Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) ,
  prenom VARCHAR(255) ,
  mdp VARCHAR(255),
  telephone VARCHAR(20),
  dateDeNaissance DATE,
  gouvernorat VARCHAR(255),
  delegation VARCHAR(255),
  codePostal VARCHAR(10),
  GroupeSanguin VARCHAR(10),
  taille FLOAT,
  poids FLOAT,
  age INT,
  longitude DECIMAL(10, 6),
  latitude DECIMAL(10, 6),
email varchar(100) NOT NULL
);

-- Pending Email Verification Table
CREATE TABLE pending_verification (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  tokenexpires BIGINT NOT NULL
);

-- Password Reset Requests Table
CREATE TABLE password_reset (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  tokenexpires BIGINT NOT NULL
);
