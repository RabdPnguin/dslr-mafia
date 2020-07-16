using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
  public class DslrController : Controller
  {
    [HttpGet, Route("games")]
    public IActionResult GetGames()
    {
      var result = TopicParser.GetGames();
      return this.Ok(result);
    }

    [HttpGet, Route("games/{id}/players")]
    public IActionResult GetPlayers(string id)
    {
      var result = ThreadParser.GetPlayers(id);
      return this.Ok(result);
    }
  }
}