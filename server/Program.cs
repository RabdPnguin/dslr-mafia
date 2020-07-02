using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace DslrMafia
{
  public class Program
  {
    public static void Main(string[] args) =>
      CreateWebHostBuilder(args).Build().Run();

    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
      WebHost.CreateDefaultBuilder(args)
        .UseStartup<Startup>()
        .UseKestrel((context, options) =>
        {
          var port = Environment.GetEnvironmentVariable("PORT");
          if (!string.IsNullOrEmpty(port))
          {
            options.ListenAnyIP(int.Parse(port));
          }
        });
  }
}
