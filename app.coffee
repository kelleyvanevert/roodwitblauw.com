
express   = require "express"
app       = express.createServer()
path      = require "path"
coffeekup = require "coffeekup"

# An ordered array of pages, with for each page, given the language,
#  an array containing the title of the page [0] and the slug [1]
pages = '''
    en, Dutch lessons in Wageningen,               home
    nl, Nederlandse les in Wageningen,             home
     ==
    en, What to expect from Roodwitblauw?,         general-information
    nl, Wat mag u van Roodwitblauw verwachten?,    algemene-informatie
     ==
    en, Who will be your teacher?,                 machteld-voerman
    nl, Even voorstellen,                          machteld-voerman
     ==
    en, Recommendations,                           recommendations
    nl, Aanbevelingen,                             aanbevelingen
'''
.split("\n").reduce ((pages, line, i) ->
    if i % 3 isnt 2
        segs = line.split ","
        if i % 3 is 0
            pages.push {}
            page = pages[i / 3]
        else
            page = pages[(i-1) / 3]
        
        page[segs[0].trim()] =
            title: segs[1].trim()
            slug: segs[2].trim()
    pages
), []

# Language + slug uniquely map to URL
url = (slug, lang) ->
    segs = []
    if lang and lang is "nl"
        segs.push lang
    if slug isnt "home"
        segs.push slug
    return "/" + segs.join "/"

app.register ".coffee", coffeekup

app.configure ->
    app.use express.static __dirname + "/public"
    app.set "view engine", "coffee"
    app.set "view options",
        context:
            pages: pages
            url: url
            meta:
                keywords: "english lessons, engels leren, engels les, wageningen, machteld, roodwitblauw, rood wit blauw"
                description: "Living in Holland is much more fun when you speak the language and understand what people are saying. Does it happen to you that you start to speak Dutch and people answer in English? Do you always understand jokes and expressions? Would you like to prevent to make mistakes, rather than have them corrected? Now is the time to improve your Dutch in a relaxed atmosphere. You decide what you want to learn and the amount and frequency of the lessons. You get a free intake of 30 minutes! Start today!"

app.get /^(?:\/(nl))?(?:(?!nl)\/([a-z0-9\-_]+))?[\/]?$/, (req, res, next) ->
    slug = req.params[1] or "home"
    lang = req.params[0] or "en"
    pageid = null
    title = null
    
    for page, i in pages
        if page[lang].slug is slug
            pageid = i
            title = page[lang].title
    
    # If we didn't find the title, then this page does not exist -- 404!
    if not title
        do next
        return
    
    res.render lang + "-" + slug,
        locals:
            pid: pageid
            pagetitle: title
            slug: slug
            language: lang

app.get "*", (req, res) ->
    res.render "404",
        locals:
            pid: null
            pagetitle: "404"
            slug: "404"
            language: "en"

app.listen 8002

