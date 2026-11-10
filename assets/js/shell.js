/* The masthead and footer, injected so one edit changes every page.
   Deliberately not a build step: the whole site has to stay viewable by
   opening a file, and a framework would put a toolchain between the author
   and the page for no gain at this size. */

(function () {
  "use strict";

  var NAV = [
    ["index.html", "Home"],
    ["screener.html", "Screener"],
    ["watch.html", "Watch list"],
    ["signals.html", "Do they work?"],
    ["build-dcf.html", "Build a DCF"],
    ["simulator.html", "Rate simulator"],
    ["report.html", "Sample report"],
    ["how-it-works.html", "How it works"],
    ["pro.html", "Pro"]
  ];

  function glyph(size) {
    return '<svg class="wordmark__glyph" width="' + size + '" height="' + size +
      '" viewBox="0 0 32 32" aria-hidden="true">' +
      '<rect width="32" height="32" rx="6" fill="var(--accent)"/>' +
      '<path d="M8 21h16M8 12.5v4M16 9.5v7M24 12.5v4" stroke="var(--bg-raised)" ' +
      'stroke-width="2.2" stroke-linecap="round"/></svg>';
  }

  function render() {
    var here = (location.pathname.split("/").pop() || "index.html");
    var depth = location.pathname.indexOf("/t/") !== -1 ? "../" : "";

    var header = document.querySelector("[data-shell-header]");
    if (header) {
      header.className = "masthead";
      header.innerHTML =
        '<div class="wrap masthead__inner">' +
          '<a class="wordmark" href="' + depth + 'index.html">' + glyph(30) +
            '<span><span class="wordmark__text">Prediqra</span>' +
            '<span class="wordmark__sub">Provenance-first</span></span></a>' +
          '<span class="spacer"></span>' +
          '<nav class="nav" aria-label="Main">' +
            NAV.map(function (n) {
              var cur = n[0] === here ? ' aria-current="page"' : "";
              return '<a href="' + depth + n[0] + '"' + cur + '>' + n[1] + "</a>";
            }).join("") +
          "</nav>" +
        "</div>";
    }

    var footer = document.querySelector("[data-shell-footer]");
    if (footer) {
      footer.className = "footer";
      footer.innerHTML =
        '<div class="wrap">' +
          '<div class="row-between">' +
            '<div class="wordmark">' + glyph(24) +
              '<span class="wordmark__text" style="font-size: var(--step-0)">' +
              'Prediqra</span></div>' +
            '<nav class="nav" aria-label="Footer">' +
              NAV.slice(1, 5).map(function (n) {
                return '<a href="' + depth + n[0] + '">' + n[1] + "</a>";
              }).join("") +
            "</nav>" +
          "</div>" +
          '<p class="footer__legal"><strong>Demo — not offered for sale. Educational, ' +
          'not investment advice.</strong> Built for FMKT 256. Figures are produced by an ' +
          'automated research engine from public filings and free data sources and have ' +
          'not been reviewed by a human analyst. Several data sources permit personal ' +
          'research only and not redistribution; figures drawn from them are marked. ' +
          'Nothing here is a recommendation to buy or sell any security.</p>' +
        "</div>";
    }

  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
