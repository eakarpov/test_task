import express from "express";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import path from "path";

import webpackConfig from "../webpack.config.dev";
import {init as router} from "./routes";
import cors from 'cors';

const app = express();
const http = require('http').Server(app);
app.use(cors());

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

  http.listen(3000, () => {
    global.io = require('socket.io')(http);
    global.io.origins('http://localhost:3000');
    global.io.on('connection', (socket) => {
      console.log(`user has been connected`);
      socket.on('disconnect', () => {
        console.log(`user has been disconnected`);
      });
    });
    console.log("Server is listening on port 3000!");
  });
};