using Xunit;

namespace DslrParser.Tests
{
  public class TopicParserTests
  {
    [Fact]
    public void Test1()
    {
      var games = TopicParser.GetGames();
    }
  }
}