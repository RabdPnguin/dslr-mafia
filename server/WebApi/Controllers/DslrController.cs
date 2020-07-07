using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
  public class DslrController : Controller
  {
    [HttpGet, Route("games")]
    public IActionResult GetGames()
    {
      return this.Ok(TopicParser.GetTopics());
    }
  }
}