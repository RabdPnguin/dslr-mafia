using System.Collections.Generic;
using Newtonsoft.Json;

namespace WebApi
{
  public static class IEnumerableExtensions
  {
    public static string Dump<T>(this IEnumerable<T> list)
    {
      return JsonConvert.SerializeObject(list);
    }
  }
}