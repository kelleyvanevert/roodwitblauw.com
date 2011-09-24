(function() {
  var app, config, express, pages, path, url;
  express = require("express");
  app = express.createServer();
  path = require("path");
  pages = 'en, Dutch lessons in Wageningen,               home\nnl, Nederlandse les in Wageningen,             home\n ==\nen, What to expect from Roodwitblauw?,         general-information\nnl, Wat mag u van Roodwitblauw verwachten?,    algemene-informatie\n ==\nen, Who will be your teacher?,                 machteld-voerman\nnl, Even voorstellen,                          machteld-voerman\n ==\nen, Recommendations,                           recommendations\nnl, Aanbevelingen,                             aanbevelingen'.split("\n").reduce((function(pages, line, i) {
    var page, segs;
    if (i % 3 !== 2) {
      segs = line.split(",");
      if (i % 3 === 0) {
        pages.push({});
        page = pages[i / 3];
      } else {
        page = pages[(i - 1) / 3];
      }
      page[segs[0].trim()] = {
        title: segs[1].trim(),
        slug: segs[2].trim()
      };
    }
    return pages;
  }), []);
  url = function(slug, lang) {
    var segs;
    segs = [];
    if (lang && lang === "nl") {
      segs.push(lang);
    }
    if (slug !== "home") {
      segs.push(slug);
    }
    return "/" + segs.join("/");
  };
  config = {
    pages: pages,
    url: url,
    meta: {
      keywords: "english lessons, engels leren, engels les, wageningen, machteld, roodwitblauw, rood wit blauw",
      description: "Living in Holland is much more fun when you speak the language and understand what people are saying. Does it happen to you that you start to speak Dutch and people answer in English? Do you always understand jokes and expressions? Would you like to prevent to make mistakes, rather than have them corrected? Now is the time to improve your Dutch in a relaxed atmosphere. You decide what you want to learn and the amount and frequency of the lessons. You get a free intake of 30 minutes! Start today!"
    }
  };
  app.configure(function() {
    app.use(express.static(__dirname + "/public"));
    return app.set("view engine", "jade");
  });
  app.get(/^(?:\/(nl))?(?:(?!nl)\/([a-z0-9\-_]+))?[\/]?$/, function(req, res, next) {
    var i, lang, page, pageid, slug, title, _len;
    slug = req.params[1] || "home";
    lang = req.params[0] || "en";
    pageid = null;
    title = null;
    for (i = 0, _len = pages.length; i < _len; i++) {
      page = pages[i];
      if (page[lang].slug === slug) {
        pageid = i;
        title = page[lang].title;
      }
    }
    if (!title) {
      next();
      return;
    }
    return res.render(lang + "-" + slug, {
      config: config,
      pid: pageid,
      pagetitle: title,
      slug: slug,
      language: lang
    });
  });
  app.get("*", function(req, res) {
    return res.render("404", {
      config: config,
      pid: null,
      pagetitle: "404",
      slug: "404",
      language: "en"
    });
  });
  app.listen(8002);
}).call(this);
