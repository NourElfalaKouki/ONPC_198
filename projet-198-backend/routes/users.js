const express  = require('express');
const router   = express.Router();
const User     = require('../models/user');
const bcrypt   = require('bcryptjs');
const connection = require('../config/db');
const {
  generateVerificationToken,
  sendVerificationEmail,
  sendPasswordResetEmail
} = require('../services/emailService');
const twilio     = require('twilio');
require('dotenv').config();

//──────────────────────────────────────────────────────────────────────────────
// LOGIN
//──────────────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, telephone, mdp } = req.body;
    const identifier = email || telephone;
    if (!identifier) {
      return res.status(400).json({ message: 'Email ou téléphone requis' });
    }

    User.findOne(identifier, async (err, user) => {
      if (err) return res.status(500).json({ message: 'Erreur Serveur' });
      if (!user) return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect' });

      const match = await bcrypt.compare(mdp, user.mdp);
      if (!match) return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect' });

      const { mdp: _, ...safeUser } = user;
      res.json({ message: 'Connexion réussie', user: safeUser });
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Erreur Serveur' });
  }
});

// REGISTRATION ROUTE
router.post('/register', async (req, res) => {
  console.log('🛂 [Register] full request body:', JSON.stringify(req.body, null, 2));
  try {
    const { email, telephone, ...fields } = req.body;
    console.log('🛂 [Register] parsed email:', email);
    console.log('🛂 [Register] parsed telephone:', telephone);
    console.log('🛂 [Register] other fields:', JSON.stringify(fields, null, 2));

    if (!email && !telephone) {
      return res.status(400).json({ message: 'Email ou téléphone requis' });
    }
    const identifierField = email ? 'email' : 'telephone';
    const identifierValue = email || telephone;

    // If verified entry exists, update it; otherwise create new
    connection.query(
      `SELECT isVerified FROM users WHERE ${identifierField} = ?`,
      [identifierValue],
      async (err, results) => {
        console.log('🛂 [Register] isVerified query results:', results);
        if (err) return res.status(500).json({ message: 'Erreur Serveur' });

        // Must be verified to proceed
        if (!results.length || results[0].isVerified !== 1) {
          return res.status(400).json({ message: 'Compte non vérifié ou introuvable' });
        }

        // Hash password
        const hashed = await bcrypt.hash(fields.mdp, 12);

        // Build update SQL
        const updateSql = `
          UPDATE users SET
            mdp = ?,
            nom = ?,
            prenom = ?,
            telephone = ?,
            dateDeNaissance = ?,
            gouvernorat = ?,
            delegation = ?,
            codePostal = ?,
            GroupeSanguin = ?,
            taille = ?,
            poids = ?,
            age = ?,
            latitude = ?,
            longitude = ?
          WHERE ${identifierField} = ?
        `;
        const params = [
          hashed,
          fields.nom,
          fields.prenom,
          telephone,
          fields.dateDeNaissance,
          fields.gouvernorat,
          fields.delegation,
          fields.codePostal,
          fields.GroupeSanguin || null,
          fields.taille || null,
          fields.poids || null,
          fields.age || null,
          fields.latitude || null,
          fields.longitude || null,
          identifierValue
        ];

        connection.query(updateSql, params, (updErr, updRes) => {
          if (updErr) {
            console.error('Update user error:', updErr);
            return res.status(500).json({ message: 'Erreur Serveur' });
          }
          if (updRes.affectedRows === 0) {
            return res.status(400).json({ message: 'Aucun enregistrement mis à jour' });
          }
          console.log('🛂 [Register] user updated');
          res.status(200).json({ message: 'Inscription complétée', userId: identifierValue });
        });
      }
    );

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Erreur Serveur' });
  }
});

//──────────────────────────────────────────────────────────────────────────────
// EMAIL VERIFICATION (Pending → users)
//──────────────────────────────────────────────────────────────────────────────

// Send verification code
router.post('/send-verification-email', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: 'Email is required.' });

  connection.query(
    'SELECT 1 FROM users WHERE email = ?', [email],
    (err, rows) => {
      if (err) return res.status(500).json({ msg: 'Server error.' });
      if (rows.length) {
        return res.status(400).json({ msg: 'Email already registered.' });
      }
      const token   = generateVerificationToken();
      const expires = Date.now() + 3600_000; // 1h

      const sql = `
        INSERT INTO pending_verifications
          (email, verificationToken, tokenExpires)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          verificationToken = VALUES(verificationToken),
          tokenExpires     = VALUES(tokenExpires)
      `;
      connection.query(sql, [email, token, expires], async upErr => {
        if (upErr) {
          console.error('DB upsert error:', upErr);
          return res.status(500).json({ msg: 'DB error.' });
        }
        try {
          await sendVerificationEmail(email, token);
          res.json({ msg: 'Verification code sent.' });
        } catch (mailErr) {
          console.error('Mail error:', mailErr);
          res.status(500).json({ msg: 'Error sending email.' });
        }
      });
    }
  );
});

// Verify code & create user
router.post('/verify-email', (req, res) => {
  const { email, verificationCode } = req.body;
  if (!verificationCode) {
    return res.status(400).json({ msg: 'No code provided.' });
  }

  const sqlSelect = `
    SELECT 1 FROM pending_verifications
    WHERE email = ? AND verificationToken = ? AND tokenExpires > ?
  `;
  connection.query(sqlSelect, [email, verificationCode, Date.now()], (err, rows) => {
    if (err) {
      console.error('DB select error:', err);
      return res.status(500).json({ msg: 'Server error.' });
    }
    if (!rows.length) {
      return res.status(400).json({ msg: 'Invalid or expired code.' });
    }

    // create in users
    connection.query(
      'INSERT INTO users (email, isVerified) VALUES (?, 1)',
      [email],
      insErr => {
        if (insErr) {
          console.error('DB insert user error:', insErr);
          return res.status(500).json({ msg: 'Error creating user.' });
        }
        // clean up
        connection.query(
          'DELETE FROM pending_verifications WHERE email = ?',
          [email],
          delErr => {
            if (delErr) console.error('Cleanup error:', delErr);
            res.json({ msg: 'Email verified and user created!' });
          }
        );
      }
    );
  });
});

//──────────────────────────────────────────────────────────────────────────────
// PASSWORD RESET
//──────────────────────────────────────────────────────────────────────────────

// Send reset token
router.post('/send-password-reset', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: 'Email is required.' });

  connection.query('SELECT 1 FROM users WHERE email = ?', [email], (err, rows) => {
    if (err) return res.status(500).json({ msg: 'Server error.' });
    if (!rows.length) {
      return res.json({ msg: 'If that email is registered, you’ll get a reset link.' });
    }

    const token   = generateVerificationToken();
    const expires = Date.now() + 3600_000;

    const sqlUpsert = `
      INSERT INTO password_resets
        (email, resetToken, tokenExpires)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        resetToken   = VALUES(resetToken),
        tokenExpires = VALUES(tokenExpires)
    `;
    connection.query(sqlUpsert, [email, token, expires], async upErr => {
      if (upErr) {
        console.error('DB upsert error:', upErr);
        return res.status(500).json({ msg: 'DB error.' });
      }
      try {
        await sendPasswordResetEmail(email, token);
        res.json({ msg: 'If that email is registered, you’ll get a reset link.' });
      } catch (mailErr) {
        console.error('Mail error:', mailErr);
        res.status(500).json({ msg: 'Error sending password reset email.' });
      }
    });
  });
});

// Reset password
router.post('/reset-password', (req, res) => {
  const {email, resetCode} = req.body;
  console.log(email,resetCode);
  if (!email||!resetCode) {
    return res.status(400).json({ msg: 'Code reset incorrect.' });
  }

  const sqlSelect = `
    SELECT 1 FROM password_resets
    WHERE email = ? AND resetToken = ? AND tokenExpires > ?
  `;
  connection.query(sqlSelect, [email, resetCode, Date.now()], async (err, rows) => {
    if (err) {
      console.error('DB select error:', err);
      return res.status(500).json({ msg: 'Server error.' });
    }
    if (!rows.length) {
      return res.status(400).json({ msg: 'Invalid or expired reset code.' });
    }
    connection.query(
      'DELETE FROM password_resets WHERE email = ?',
      [email],
      (delErr) => {
        if (delErr) {
          console.error('DB delete error:', delErr);
          return res.status(500).json({ msg: 'Erreur Serveur.' });
        }
        res.json({ msg: 'Code validé et supprimé.' });
      }
    );
  });
});

//──────────────────────────────────────────────────────────────────────────────
// TWILIO SMS VERIFICATION
//──────────────────────────────────────────────────────────────────────────────
/*const accountSid     = process.env.TWILIO_SID;
const authToken      = process.env.TWILIO_TOKEN;
const verifyService  = twilio(accountSid, authToken)
                         .verify
                         .services(process.env.TWILIO_VERIFY_SID);

router.post('/send-verification-code', async (req, res) => {
  const { telephone } = req.body;
  if (!telephone) {
    return res.status(400).json({ msg: 'Please provide a valid phone number.' });
  }
  try {
    await verifyService.verifications.create({ to: telephone, channel: 'sms' });
    res.json({ msg: 'SMS verification code sent.' });
  } catch (err) {
    console.error('Twilio error:', err);
    res.status(500).json({ msg: 'Error sending SMS.' });
  }
});

router.post('/verify-sms', async (req, res) => {
  const { telephone, verificationCode } = req.body;
  try {
    const check = await verifyService.verificationChecks.create({
      to: telephone,
      code: verificationCode
    });
    if (check.status === 'approved') {
      res.json({ msg: 'Phone number verified!' });
    } else {
      res.status(400).json({ msg: 'Invalid verification code.' });
    }
  } catch (err) {
    console.error('Twilio verify error:', err);
    res.status(500).json({ msg: 'Server error.' });
  }
});
*/
//──────────────────────────────────────────────────────────────────────────────
// PROFILE & LOCATION
//──────────────────────────────────────────────────────────────────────────────
router.get('/ShowProfile', (req, res) => {
  const { userId } = req.body;
  connection.query(
    'SELECT * FROM users WHERE id = ?',
    [userId],
    (err, results) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).send('Erreur Serveur');
      }
      res.json(results[0] || {});
    }
  );
});

router.put('/UpdateProfile', (req, res) => {
  const { userId, GroupeSanguin, taille, poids, age, dateDeNaissance } = req.body;
  const updates = [];
  const values  = [];

  if (GroupeSanguin)   { updates.push('GroupeSanguin = ?');   values.push(GroupeSanguin); }
  if (dateDeNaissance) { updates.push('dateDeNaissance = ?'); values.push(dateDeNaissance); }
  if (taille)          { updates.push('taille = ?');          values.push(taille); }
  if (poids)           { updates.push('poids = ?');           values.push(poids); }
  if (age)             { updates.push('age = ?');             values.push(age); }
  values.push(userId);

  const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
  connection.query(sql, values, (err) => {
    if (err) {
      console.error('DB update error:', err);
      return res.status(500).send('Erreur Serveur');
    }
    res.send('Profil mis à jour avec succès');
  });
});

router.post('/updateLocation', (req, res) => {
  const { userId, latitude, longitude } = req.body;
  connection.query(
    'UPDATE users SET latitude = ?, longitude = ? WHERE id = ?',
    [latitude, longitude, userId],
    (err, results) => {
      if (err) {
        console.error('DB location error:', err);
        return res.status(500).json({ error: 'Erreur Serveur' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }
      res.json({ message: 'Localisation mise à jour.' });
    }
  );
});
router.post('/getUserData', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'Paramètre userId manquant' });
  }
  connection.query(
    'SELECT id, nom, prenom, email, telephone, dateDeNaissance, gouvernorat, delegation, codePostal, GroupeSanguin, taille, poids, age, latitude, longitude FROM users WHERE id = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur Serveur' });
      if (!results.length) return res.status(404).json({ message: 'Utilisateur non trouvé' });
      res.json(results[0]);
    }
  );
});
router.post('/updatepassword', async (req, res) => {
  try {
    const { mdp, email, telephone } = req.body;
    if (!mdp) return res.status(400).json({ message: 'Mot de passe requis' });
    if (!email && !telephone) return res.status(400).json({ message: 'Email ou téléphone requis' });

    const hash = await bcrypt.hash(mdp, 12);
    const identifierField = email ? 'email' : 'telephone';
    const identifierValue = email || telephone;

    connection.query(
      `UPDATE users SET mdp = ? WHERE ${identifierField} = ?`,
      [hash, identifierValue],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur Serveur' });
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: `Aucun utilisateur trouvé pour ${identifierField}` });
        }
        connection.query(
          `SELECT id FROM users WHERE ${identifierField} = ?`,
          [identifierValue],
          (selErr, rows) => {
            if (selErr) return res.status(500).json({ message: 'Erreur Serveur' });
            if (!rows.length) return res.status(500).json({ message: 'Utilisateur introuvable après mise à jour' });
            res.json({ message: 'Mot de passe mis à jour avec succès', userId: rows[0].id });
          }
        );
      }
    );
  } catch (err) {
    console.error('updatepassword error:', err);
    res.status(500).json({ message: 'Erreur Serveur' });
  }
});

module.exports = router;
