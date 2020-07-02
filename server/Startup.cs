using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DslrMafia
{
  public class Startup
  {
    private readonly IConfiguration config;

    public Startup(IConfiguration config)
    {
      this.config = config;
    }

    [System.Obsolete]
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

      services.AddNodeServices();
      services.AddCors();
      services.AddMemoryCache();

      services.AddSpaStaticFiles(spa => spa.RootPath = "../client/build");
    }

    [System.Obsolete]
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
      app.UseCors(config => config
        .AllowAnyMethod()
        .AllowAnyHeader()
        .WithOrigins("http://localhost:3000")
        .AllowCredentials());

      app.UseStaticFiles();
      app.UseSpaStaticFiles();
      app.UseMvc();
      app.UseSpa(spa => spa.Options.SourcePath = "../client");
    }
  }
}
