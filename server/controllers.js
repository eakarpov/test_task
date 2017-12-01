import { exec } from "child_process";
import store from "./list";
import NmapJob from './jobs/NmapJob';

export function launch(req, res) {
  let command, host, timeStart;
  try {
    const data = JSON.parse(req.query.data);
    command = req.query.command;
    host = req.query.host;
    timeStart = new Date().getTime();
    const nmapJob = new NmapJob();
    nmapJob.run({ command, host, data });
    // nmapJob.terminate();
    // nmapJob.get().then(res => {
    //   console.log("adasd" + res);
    //   // store.add({
    //     //   key: store.size(),
    //     //   host,
    //     //   command,
    //     //   timeStart,
    //     //   timeEnd: new Date().getTime(),
    //     //   value: res,
    //     //   status: 1
    //     // })
    //   // res.send(store);
    //   });
  } catch (err) {
    console.log("Error handling should be here: " + err);
    store.add({
      host,
      command,
      timeStart,
      timeEnd: new Date().getTime(),
      value: err.message,
      status: 0
    });
    res.send(store);
  }
}

export function list(req, res) {
  try {
    res.send(store);
  } catch (err) {
    res.send(err);
  }
}
