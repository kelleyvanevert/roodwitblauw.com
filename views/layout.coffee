doctype 5
html ->
  head ->
    meta charset: "utf-8"
    title (pagetitle + ' - ' or '') + "Rood Wit Blauw"
    link rel: "shortcut icon", href:"favicon.ico"
    link rel: "stylesheet", type: "text/css", href: "/style.min.css"
    meta name: "keywords", content: @meta.keywords
    meta name: "description", content: @meta.description
  body ->
    ul class: "menu", ->
      for page, i in @pages
        li -> a href: @url(page[language].slug, language), class: ("active" if pid is i), title: page[language].title, -> page[language].title
    ul class: "language-menu", ->
      li -> a href: @url(@pages[pid or 0]["en"].slug, "en"), class: ("active" if language is "en" and pid isnt null), title: "In English", -> "English"
      li -> a href: @url(@pages[pid or 0]["nl"].slug, "nl"), class: ("active" if language is "nl" and pid isnt null), title: "In het Nederlands", -> "Nederlands"
    div class: "content", -> @body
    div class: "footer", ->
      p -> "&copy; Rood Wit Blauw 2011"
      p ->
        text "Website door: "
        a href: "http://kelleyvanevert.nl/", -> "Kelley"
      p ->
        a href: "/algemene-voorwaarden.pdf", -> "Algemene Voorwaarden"
        text " - "
        a href: "/klachtenprocedure.pdf", -> "Klachtenprocedure"
