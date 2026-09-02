// ===== KELLART CLEANERS — Analytics configuration =====
// This is the ONLY file you need to edit to turn on real tracking.
//
// 1. Google Analytics (GA4): create a property at analytics.google.com,
//    copy its Measurement ID (looks like "G-ABC1234XYZ") and paste it below.
// 2. Meta Pixel: create a pixel at business.facebook.com/events_manager,
//    copy its Pixel ID (a long number) and paste it below.
//
// Until you replace these placeholder values, analytics.js will skip
// loading GA/Meta entirely (no broken requests, no console errors) and
// will just log a reminder to the browser console instead.

window.KELLART_ANALYTICS_CONFIG = {
  GA_MEASUREMENT_ID: "G-XXXXXXXXXX",   // TODO: replace with your GA4 Measurement ID
  META_PIXEL_ID: "0000000000000000"    // TODO: replace with your Meta Pixel ID
};

// Set to true while testing to see tracked events logged in the browser console.
window.KELLART_DEBUG = false;
