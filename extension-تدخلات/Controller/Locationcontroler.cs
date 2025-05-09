
using Microsoft.AspNetCore.Mvc;
using LocationApp.Models;
using LocationApp.Data;


namespace LocationApp.Controllers
{
    public class LocationController : Controller
    {
        private readonly ApplicationDbContext _context;

        public LocationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Save([FromBody] Utilisateur location)
        {
            try
            {
                if (location != null)
                {
                    _context.users.Add(location);
                    _context.SaveChanges();

                    return Ok("Location data saved successfully");
                }
                else
                {
                    return BadRequest("Invalid location data");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while saving location data: {ex.Message}");
            }
        }

        public IActionResult Index()
        {
            var locations = _context.users.ToList();
            ViewBag.Title = "Liste des localisations";
            return View(locations);
        }

        public IActionResult EmergencyPage()
        {
            return View();
        }
public IActionResult Map(int userId)
{
    // Récupérer les données de l'utilisateur, y compris les coordonnées de localisation
    var userData = _context.users.FirstOrDefault(u => u.Id == userId);

    if (userData != null)
    {
        // Utiliser ViewBag pour passer les données à la vue
        ViewBag.RecipientName = userData.Nom + " " + userData.Prenom;
        ViewBag.UserId = userData.Id;
        
        // Vérifier si les coordonnées de localisation sont NULL avant de les utiliser
        if (userData.Latitude != null && userData.Longitude != null)
        {
            ViewBag.Latitude = userData.Latitude;
            ViewBag.Longitude = userData.Longitude;
        }
        else
        {
            // Si les coordonnées sont NULL, affecter une valeur par défaut
            ViewBag.Latitude =  10.292263 ; // Valeur de latitude par défaut
            ViewBag.Longitude = 36.966995; // Valeur de longitude par défaut
        }
    }
    else
    {
        // Si l'utilisateur n'est pas trouvé, afficher un message par défaut
        ViewBag.RecipientName = "Nom Prénom du Destinataire";
    }

    return View();
}


public JsonResult GetData(int userId)
{
    var user = _context.users.FirstOrDefault(u => u.Id == userId);

    if (user != null)
    {
        // Utiliser la syntaxe ternaire pour vérifier si la latitude et la longitude sont nulles
        // Si elles sont nulles, utiliser les valeurs par défaut, sinon, utiliser les valeurs existantes
        var latitude = user.Latitude ?? 10.292263; // Valeur de latitude par défaut si null
        var longitude = user.Longitude ?? 36.966995; // Valeur de longitude par défaut si null

        // Créer un objet contenant les données utilisateur avec les valeurs de latitude et de longitude mises à jour
        var userData = new
        {
            user.Id,
            user.Nom,
            user.Prenom,
            user.Mdp,
            user.Telephone,
            user.DateDeNaissance,
            user.Gouvernorat,
            user.Delegation,
            user.CodePostal,
            user.GroupeSanguin,
            user.Taille,
            user.Poids,
            user.Age,
            Latitude = latitude,
            Longitude = longitude
        };

        return Json(userData);
    }
    else
    {
        return Json(null); // Retourner null si l'utilisateur n'est pas trouvé
    }
}

    }
}


