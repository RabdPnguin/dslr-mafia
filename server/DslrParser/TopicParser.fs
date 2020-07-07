﻿module TopicParser

open System.Linq
open FSharp.Data

#if DEBUG
let [<Literal>] private url = "./TestData/Topics.html"
#else
let [<Literal>] private url = "https://www.dslreports.com/forum/pubgames"
#endif

type private TopicsProvider = HtmlProvider<url>

type Topic = {Title: string; Author: string; Group: string}

let private getHtml () = TopicsProvider.Load(url).Tables.Table6.Html
let private getTopicsHtml (page: HtmlNode) = page.CssSelect(".td_topic")
let private getGroupsHtml (page: HtmlNode) = page.CssSelect(".td_group") |> Seq.skip 1

let private valueOrDefault (node: HtmlNode option) =
  match node with
  | Some value -> value.InnerText().Trim()
  | None -> ""

let private getTitleAndAuthor (post: HtmlNode) =
  let a = post.CssSelect("a")
  let title = Seq.tryHead a |> valueOrDefault
  let author = Seq.tryLast a |> valueOrDefault
  (title, author)

let private getGroup (post: HtmlNode) =
  let a = post.CssSelect("a")
  let group = Seq.tryHead a |> valueOrDefault
  group

let private getTopic (topic: HtmlNode, group: HtmlNode) =
  let (title, author) = getTitleAndAuthor(topic)
  let group = getGroup(group)
  {Title = title; Author = author; Group = group}

let private filterGame (topic: Topic) = topic.Group = "game"

let GetTopics () =
  let page = getHtml()
  let topics = getTopicsHtml page
  let groups = getGroupsHtml page
  Seq.zip topics groups
    |> Seq.map(getTopic)
    |> Seq.filter(filterGame)