module ThreadParser

open System
open FSharp.Data

let private url = "./TestData/Thread.html"

type Players = string list

let private getHtml () = HtmlDocument.Load(url).Html()

let private isEmptyOrElement value = String.IsNullOrEmpty value || value.StartsWith('<')
let private notEmptyOrElement = not << isEmptyOrElement

let private isNotPlayerList (line: string) =
  line.IndexOf("Player List", StringComparison.OrdinalIgnoreCase) = -1

let private parsePlayers (post: HtmlNode option) =
  match post with
  | None -> []
  | Some p ->
    let td = p.CssSelect("td")
    td.[td.Length - 1]
    |> fun node -> node.CssSelect(".forum_post")
    |> Seq.tryHead
    |> fun node ->
      match node with
      | None -> []
      | Some value ->
        value.ToString()
        |> fun text -> text.Split("\r\n")
        |> Seq.skipWhile(isNotPlayerList)
        |> Seq.skip 1
        |> Seq.skipWhile(isEmptyOrElement)
        |> Seq.takeWhile(notEmptyOrElement)
        |> Seq.toList

let private getPlayers (page: HtmlNode) =
  page.CssSelect(".soft-tbl-5").Head.CssSelect("tr")
  |> Seq.tryHead
  |> parsePlayers

let GetPlayers (id: string) = getHtml() |> getPlayers