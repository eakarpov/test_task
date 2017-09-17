import { launch, list } from "./controllers";

let app = null;

export const init = (expressApp) => {
  app = expressApp;
  app.get("/api/launch/", launch);
  app.get("/api/list/", list);
};