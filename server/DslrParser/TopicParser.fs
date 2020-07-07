module TopicParser

open System.Linq
open FSharp.Data

#if DEBUG
let [<Literal>] private url = "./TestData/Topics.html"
#else
let [<Literal>] private url = "https://www.dslreports.com/forum/pubgames"
#endif

type private TopicsProvider = HtmlProvider<url>

type Topic = {Title: string; Author: string}

let private getTitleAndAuthor (post: HtmlNode) =
  let a = post.CssSelect("a")
  let title = a.First().InnerText().Trim()
  let author = a.Last().InnerText().Trim()
  {Title = title; Author = author}

let GetTopics () =
  TopicsProvider.Load(url).Tables.Table6.Html.CssSelect(".td_topic")
    |> Seq.map(fun post -> post |> getTitleAndAuthor)