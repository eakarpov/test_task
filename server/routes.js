import { launch, list, create, start, stop } from "./controllers";

let app = null;

export const init = (expressApp) => {
  app = expressApp;
  app.get("/api/launch/", launch);
  app.get("/api/list/", list);
  app.get("/api/create/", create);
  app.get("/api/start/", start);
  app.get("/api/stop/", stop);
};