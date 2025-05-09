
// Startup.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using LocationApp.Data;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;




namespace LocationApp
{
    public class Startup
    {
        private IConfiguration _configuration;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
            services.AddDbContext<ApplicationDbContext>(options =>
            options.UseMySql(_configuration.GetConnectionString("MySqlConnection"), new MySqlServerVersion(new Version(8, 0, 36))));
            services.AddAuthorization();
            services.AddSignalR();

            }




        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();
            
            app.UseEndpoints(endpoints =>
{
    // Définition de la route par défaut pour l'action EmergencyPage
        endpoints.MapControllerRoute(
            name: "default",
            pattern: "",
            defaults: new { controller = "Location", action = "EmergencyPage" });

    // Ajout d'un endpoint pour l'action Index
        endpoints.MapControllerRoute(
            name: "index",
            pattern: "Location/Index",
            defaults: new { controller = "Location", action = "Index" });
        endpoints.MapControllerRoute(
            name: "data",
            pattern: "Location/GetData",
            defaults: new { controller = "Location", action = "GetData" });

    
    endpoints.MapControllerRoute(
        name: "locationSave",
        pattern: "Location/Save",
        defaults: new { controller = "Location", action = "Save" });

   
    endpoints.MapControllerRoute(
        name: "map",
        pattern: "Location/Map",
        defaults: new { controller = "Location", action = "Map" });
    endpoints.MapControllerRoute(
        name: "getUserDetails",
        pattern: "Location/GetData/{userId}", 
        defaults: new { controller = "Location", action = "GetData" });
    endpoints.MapControllerRoute(
    name: "map",
    pattern: "Location/Map/{userId?}", // Ajoutez {userId?} pour indiquer qu'il s'agit d'un paramètre optionnel
    defaults: new { controller = "Location", action = "Map" });

    
});

        }
    }
}
