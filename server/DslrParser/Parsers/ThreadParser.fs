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
  let table = page.CssSelect(".soft-tbl-5").Head
  let authors = table.CssSelect(".authorName").CssSelect("a") |> Seq.map(fun a -> a.InnerText())
  let posts = table.CssSelect(".forum_post") |> Seq.map(fun p -> p.ToString())
  Seq.zip authors posts |> Seq.map(fun (a, p) -> (a.ToString(), p))

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