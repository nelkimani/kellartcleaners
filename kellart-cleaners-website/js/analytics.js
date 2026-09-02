// ===== KELLART CLEANERS — Analytics boot + event tracking =====
// Reads js/analytics-config.js. Do not hardcode IDs here — edit that file instead.

(function () {
  var cfg = window.KELLART_ANALYTICS_CONFIG || {};
  var gaId = cfg.GA_MEASUREMENT_ID || "";
  var pixelId = cfg.META_PIXEL_ID || "";

  var gaConfigured = gaId && gaId.indexOf("XXXX") === -1;
  var pixelConfigured = pixelId && pixelId.indexOf("0000") === -1;

  /* ---------------- Google Analytics (GA4) ---------------- */
  if (gaConfigured) {
    var gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=" + gaId;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", gaId);
  } else {
    console.info("[Kellart Analytics] GA4 not configured yet — set GA_MEASUREMENT_ID in js/analytics-config.js");
  }

  /* ---------------- Meta Pixel ---------------- */
  if (pixelConfigured) {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq("init", pixelId);
    window.fbq("track", "PageView");

    var noscript = document.createElement("noscript");
    var img = document.createElement("img");
    img.height = 1; img.width = 1; img.style.display = "none";
    img.src = "https://www.facebook.com/tr?id=" + pixelId + "&ev=PageView&noscript=1";
    noscript.appendChild(img);
    document.body ? document.body.appendChild(noscript) : document.addEventListener("DOMContentLoaded", function(){ document.body.appendChild(noscript); });
  } else {
    console.info("[Kellart Analytics] Meta Pixel not configured yet — set META_PIXEL_ID in js/analytics-config.js");
  }

  /* ---------------- Shared event tracking helper ---------------- */
  // Fires the same named event to both GA4 and Meta Pixel (as a custom event),
  // so you don't need to call each vendor separately from the rest of the site.
  window.trackEvent = function (name, params) {
    params = params || {};
    if (window.gtag) window.gtag("event", name, params);
    if (window.fbq) window.fbq("trackCustom", name, params);
    if (window.KELLART_DEBUG) console.log("[Kellart Analytics] event:", name, params);
  };
})();
