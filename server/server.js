import express from "express";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import path from "path";

import webpackConfig from "../webpack.config.dev";
import {init as router} from "./routes";

const app = express();

const initWebpack = () => {
  const compiler = webpack(webpackConfig);
  app.use(webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  }));
};

const initExpress = () => {
  app.use(express.static(path.join(__dirname, "../client/public"))); // serve static files from public folder
  router(app);
};

export const start = () => {
  initWebpack();
  initExpress();

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/public/index.html"));
  });

  app.listen(3000, () => {
    console.log("Server is listening on port 3000!");
  });
};