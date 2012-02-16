
var _ = require("./underscore"),
    fs = require("fs"),
    template,
    pages = [];

_.templateSettings = {
  evaluate    : /\[%([\s\S]+?)%\]/g,
  interpolate : /\[%=([\s\S]+?)%\]/g,
  escape      : /\[%-([\s\S]+?)%\]/g
};

console.log("Hi!");
console.log("reading template...");
try {
  template = _.template(fs.readFileSync("template.html", "utf8"));
} catch (e) {
  console.log("  !! ERROR reading template.html");
  process.exit();
}
console.log("  DONE");

console.log("reading content...");
try {
  fs.readdirSync("content").map(function (file) {
    console.log("    [" + file + "]");
    var raw = fs.readFileSync("content/" + file, "utf8").split("==="),
        page = JSON.parse(raw[0].trim());
    console.log("      JSON OK");
    
    if (raw.length != 3) {
      console.log("  !! ERROR template does not consist of 3 parts!");
      throw false;
    }
    console.log("      content OK");
    
    page.id = file.replace(".html", "");
    page.content = {
      en: raw[1],
      nl: raw[2]
    };
    
    pages.push(page);
  });
} catch (e) {
  console.log("  !! ERROR reading content/*.html");
  process.exit();
}
pages.sort(function (a, b) {
  if (a.sort == b.sort) {
    return 0;
  }
  return a.sort > b.sort ? 1 : -1;
});
console.log("  DONE");

console.log("generating html...");
var homepage = _.find(pages, function (page) {
  return page.id == "home";
});
pages.map(function (page) {
  console.log("    " + page.id);
  ["nl", "en"].map(function (currentlanguage) {
    console.log("      " + currentlanguage);
    var context = {
        currentlanguage: currentlanguage,
        currentpage: page,
        homepage: homepage,
        pages: pages
      },
      html = template(context);
    fs.writeFileSync(page.url[currentlanguage], html, "utf8");
  });
});
console.log("  DONE");
