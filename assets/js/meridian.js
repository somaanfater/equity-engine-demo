/* Meridian — shared behaviour. No framework, no build, no network. */

(function () {
  "use strict";

  /* No theme machinery. The site is dark only, so there is no toggle, no
     stored preference, and no class to apply before paint. */

  /* --- provenance --------------------------------------------------------
     The cards are CSS-driven for hover. This adds the keyboard path: every
     provenance mark is focusable, and Escape closes an open one. A
     hover-only disclosure would make every sourced number unreachable to a
     keyboard or screen-reader user, which for this product means the whole
     argument is unreachable. */
  function wireProvenance(root) {
    (root || document).querySelectorAll(".prov").forEach(function (el) {
      if (el.dataset.wired) return;
      el.dataset.wired = "1";
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
      if (!el.hasAttribute("role")) el.setAttribute("role", "button");
      const card = el.querySelector(".prov__card");
      if (card) {
        card.setAttribute("role", "tooltip");
        el.setAttribute("aria-describedby", card.id || "");
      }
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.activeElement &&
        document.activeElement.classList.contains("prov")) {
      document.activeElement.blur();
    }
  });

  /* --- formatting --------------------------------------------------------
     One place, so a number never appears in two shapes on two pages. */
  const fmt = {
    money: function (v, dp) {
      if (v === null || v === undefined || !isFinite(v)) return "n/a";
      const d = dp === undefined ? 2 : dp;
      return "$" + v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
    },
    pct: function (v, dp) {
      if (v === null || v === undefined || !isFinite(v)) return "n/a";
      const d = dp === undefined ? 1 : dp;
      return (v * 100).toFixed(d) + "%";
    },
    mult: function (v, dp) {
      if (v === null || v === undefined || !isFinite(v)) return "n/a";
      return v.toFixed(dp === undefined ? 1 : dp) + "×";
    },
    big: function (v) {
      if (v === null || v === undefined || !isFinite(v)) return "n/a";
      const a = Math.abs(v);
      if (a >= 1e12) return (v / 1e12).toFixed(2) + "T";
      if (a >= 1e9) return (v / 1e9).toFixed(1) + "B";
      if (a >= 1e6) return (v / 1e6).toFixed(1) + "M";
      if (a >= 1e3) return (v / 1e3).toFixed(1) + "K";
      return v.toFixed(0);
    },
    num: function (v, dp) {
      if (v === null || v === undefined || !isFinite(v)) return "n/a";
      return v.toFixed(dp === undefined ? 2 : dp);
    }
  };

  /* --- band ---------------------------------------------------------------
     Positions a confidence band from low/point/high plus an optional mark
     (usually the current price). Everything is clamped into the band's own
     domain, which is padded 8% either side so a point estimate at an extreme
     is still visible rather than clipped to the edge. */
  function placeBand(el, lo, point, hi, mark) {
    const values = [lo, hi, point].concat(mark === undefined || mark === null ? [] : [mark]);
    const min = Math.min.apply(null, values);
    const max = Math.max.apply(null, values);
    const pad = (max - min) * 0.08 || 1;
    const d0 = min - pad, d1 = max + pad;
    const at = function (v) { return ((v - d0) / (d1 - d0) * 100).toFixed(2) + "%"; };
    el.style.setProperty("--band-lo", at(lo));
    el.style.setProperty("--band-hi", at(hi));
    el.style.setProperty("--band-tick", at(point));
    if (mark !== undefined && mark !== null) el.style.setProperty("--band-mark", at(mark));
    return { at: at, domain: [d0, d1] };
  }

  /* --- sparkline ------------------------------------------------------------ */
  function sparkline(svg, series) {
    if (!series || series.length < 2) return;
    const w = 100, h = 100;
    const lo = Math.min.apply(null, series), hi = Math.max.apply(null, series);
    const span = (hi - lo) || 1;
    const pts = series.map(function (v, i) {
      return [(i / (series.length - 1)) * w, h - ((v - lo) / span) * h];
    });
    const d = pts.map(function (p, i) {
      return (i ? "L" : "M") + p[0].toFixed(2) + " " + p[1].toFixed(2);
    }).join(" ");
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.innerHTML =
      '<path class="spark__area" d="' + d + " L" + w + " " + h + " L0 " + h + ' Z"/>' +
      '<path d="' + d + '"/>';
  }

  window.Meridian = {
    fmt: fmt,
    placeBand: placeBand,
    sparkline: sparkline,
    wireProvenance: wireProvenance
  };

  document.addEventListener("DOMContentLoaded", function () {
    wireProvenance(document);
  });
})();
