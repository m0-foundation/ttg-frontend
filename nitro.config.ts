import { defineNitroConfig } from "nitropack/config";
import { defineCorsEventHandler } from "@nozomuikuta/h3-cors";

// enable CORS for dev service
export default defineNitroConfig({
  devHandlers: [
    {
      route: "/",
      handler: defineCorsEventHandler({}),
    },
    {
      route: "/*",
      handler: defineCorsEventHandler({}),
    },
  ],
});
