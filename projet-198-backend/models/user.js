const connection = require('../config/db');

// Modèle utilisateur
class User {
    constructor(user) {
        this.id = user.id;
        this.nom = user.nom;
        this.prenom = user.prenom;
        this.mdp = user.mdp;
        this.telephone = user.telephone;
        this.dateDeNaissance = user.dateDeNaissance;
        this.gouvernorat = user.gouvernorat;
        this.delegation = user.delegation;
        this.codePostal = user.codePostal;
        this.GroupeSanguin = user.GroupeSanguin;
        this.taille = user.taille;
        this.poids = user.poids;
        this.age = user.age;
        
    }

    // Méthode pour enregistrer un nouvel utilisateur dans la base de données
    static create(newUser, result) {
        connection.query('INSERT INTO users SET ?', newUser, (err, res) => {
            if (err) {
                console.error('Erreur lors de l\'enregistrement de l\'utilisateur :', err);
                result(err, null);
                return;
            }
            console.log('Nouvel utilisateur enregistré :', { id: res.insertId, ...newUser });
            result(null, { id: res.insertId, ...newUser });
        });
    }

    // Méthode pour trouver un utilisateur par adresse e-mail
    static findOne(telephone, result) {
        connection.query('SELECT * FROM users WHERE telephone = ?', [telephone], (err, res) => {
            if (err) {
                console.error('Erreur lors de la recherche de l\'utilisateur :', err);
                result(err, null);
                return;
            }

            if (res.length) {
                // L'utilisateur existe déjà
                result(null, res[0]);
                return;
            }

            // Aucun utilisateur trouvé avec cette adresse e-mail
            result(null, null);
        });
    }

}

module.exports = User;


