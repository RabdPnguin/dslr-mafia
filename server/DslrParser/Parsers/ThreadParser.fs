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
      let author = node.CssSelect(".authorName").CssSelect("a").Head.InnerText()
      let post = node.CssSelect(".forum_post").Head.ToString()
      (author.ToLower(), post))

let private getPages (gameId: string) =
  seq {
    for i = 0 to 6 do
      let html = getHtml (gameId, i)
      let posts = html |> getPosts
      yield! posts
  }

let GetPlayers (gameId: string) =
  getPages gameId
  |> Seq.takeWhile(fun (_, post) -> notEmpty(post))
  |> Seq.map(fun (author, post) -> {Name=author; Post=post})