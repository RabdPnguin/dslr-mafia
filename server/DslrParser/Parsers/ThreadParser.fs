module ThreadParser

open System
open FSharp.Data

let private url id page = "https://www.dslreports.com/forum/" + id + "~start=" + (page * 30).ToString()

type Player = {Name: string; Post: string}
type Players = Player list

let private getHtml (gameId: string, page: int) = HtmlDocument.Load(url gameId page).Html()

let private isEmpty (value: string) =
  let v = value.Trim()
  String.IsNullOrEmpty v

let private notEmpty = not << isEmpty

let private getPosts (page: HtmlNode) =
  page.CssSelect("td[data-rmid]")
    |> Seq.map(fun node ->
      let post = node.CssSelect(".forum_post").Head.ToString()
      let author = node.CssSelect(".authorName").CssSelect("a").Head.InnerText()
      (author.ToLower(), post))

let private getPages (gameId: string) =
  let mutable page = 0
  let mutable keepFetching = true
  let mutable pages = []

  while keepFetching do
    let html = getHtml(gameId, page)
    let posts = html |> getPosts |> Seq.toList
    if posts.Length = 0 then
      keepFetching <- false
    else
      page <- page + 1
      pages <- posts |> List.append pages

  pages

let GetPlayers (gameId: string) =
  getPages gameId
  |> Seq.map(fun (author, post) -> {Name=author; Post=post})