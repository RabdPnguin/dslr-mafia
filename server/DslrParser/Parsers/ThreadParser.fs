module ThreadParser

open System
open FSharp.Data

#if DEBUG
let private url id = "./TestData/" + id + ".html"
#else
let private url id = "https://www.dslreports.com/forum/" + id
#endif

type Players = string list

let private getHtml (gameId: string) = HtmlDocument.Load(url gameId).Html()

let private isEmptyOrElement (value: string) = 
  let v = value.Trim()
  String.IsNullOrEmpty v || v.StartsWith('<')

let private notEmptyOrElement = not << isEmptyOrElement
let private isNotPlayerList (line: string) =
  line.IndexOf("Player List", StringComparison.OrdinalIgnoreCase) = -1

let private parsePlayers (post: HtmlNode option) =
  match post with
  | None -> Seq.empty
  | Some p ->
    let td = p.CssSelect("td")

    Seq.last td
    |> fun node -> node.CssSelect(".forum_post")
    |> Seq.tryHead
    |> fun node ->
      match node with
      | None -> Seq.empty
      | Some value ->
        value.ToString()
        |> fun txt -> txt.Split([|"\r"; "\n"; "\r\n"; "<br>"|], StringSplitOptions.RemoveEmptyEntries)
        |> Seq.skipWhile(isNotPlayerList)
        |> Seq.skipWhile(isEmptyOrElement)
        |> Seq.takeWhile(notEmptyOrElement)

let private getPlayers (page: HtmlNode) =
  page.CssSelect(".soft-tbl-5").Head.CssSelect("tr")
    |> Seq.tryHead
    |> parsePlayers

let GetPlayers (gameId: string) =
  getHtml gameId
  |> getPlayers
  |> Seq.toArray