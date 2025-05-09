using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LocationApp.Models
{
    public class Utilisateur
    {
        public int Id { get; set; }
        
        public string Nom { get; set; }
        
        public string Prenom { get; set; }
        
        public string Mdp { get; set; }
        
        public string Telephone { get; set; }
        
        
        public DateTime? DateDeNaissance { get; set; }
        
        public string? Gouvernorat { get; set; }
        
        public string? Delegation { get; set; }
        
        public string? CodePostal { get; set; }
        
        public string? GroupeSanguin { get; set; }
        
        public float? Taille { get; set; }
        
        public float? Poids { get; set; }
        
        public int? Age { get; set; }
        
        public double? Latitude { get; set; }
        
        public double? Longitude { get; set; }
    }
}
