using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
  public class DslrController : Controller
  {
    [HttpGet, Route("games")]
    public IActionResult GetGames()
    {
      var result = TopicParser.GetGames().ToList();
      return this.Ok(result);
    }

    [HttpGet, Route("games/{id}/players")]
    public IActionResult GetPlayers(string id)
    {
      var result = ThreadParser.GetPlayers(id).ToList();
      return this.Ok(result);
    }
  }
}