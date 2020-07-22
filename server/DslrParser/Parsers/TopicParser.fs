module TopicParser

open FSharp.Data

#if DEBUG
let private url = "./TestData/Topics.html"
#else
let private url = "https://www.dslreports.com/forum/pubgames"
#endif

type Topic = {Id: string; Title: string; Author: string; Group: string}

let private getHtml () = HtmlDocument.Load(url).Html()
let private getTopicsHtml (page: HtmlNode) = page.CssSelect(".td_topic")
let private getGroupsHtml (page: HtmlNode) = page.CssSelect(".td_group") |> Seq.skip 1

let private valueOrDefault (node: HtmlNode option) =
  match node with
  | Some value -> value.InnerText().Trim()
  | None -> ""

let private getIdAndTitle (node: HtmlNode option) =
  match node with
  | None -> ("", "")
  | Some value ->
    match value.TryGetAttribute("href") with
    | None -> ("", "")
    | Some href -> (href.Value().[7..], valueOrDefault(Some value))

let private getTitleAndAuthor (post: HtmlNode) =
  let a = post.CssSelect("a")
  let (id, title) = Seq.tryHead a |> getIdAndTitle
  let author = Seq.tryLast a |> valueOrDefault
  (id, title, author)

let private getGroup (post: HtmlNode) =
  let a = post.CssSelect("a")
  let group = Seq.tryHead a |> valueOrDefault
  group

let private getTopic (topic: HtmlNode, group: HtmlNode) =
  let (id, title, author) = getTitleAndAuthor(topic)
  let group = getGroup(group)
  {Id = id; Title = title; Author = author; Group = group}

let private filterGame (topic: Topic) = topic.Group = "game"

let GetGames () =
  let page = getHtml()
  let topics = getTopicsHtml page
  let groups = getGroupsHtml page
  Seq.zip topics groups
    |> Seq.map(getTopic)
    |> Seq.filter(filterGame)
    |> Seq.toArray