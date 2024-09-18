// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://0e71ae755566a629ea83be33cfeb2e60@o4507885348651008.ingest.de.sentry.io/4507885350551632",

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
