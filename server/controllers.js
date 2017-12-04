import store from "./list";
import NmapJob from './jobs/NmapJob';

export function launch(req, res) {
  let command, host, timeStart, key;
  try {
    const data = JSON.parse(req.query.data);
    command = req.query.command;
    host = req.query.host;
    key = req.query.key;
    timeStart = new Date().getTime();
    const nmapJob = new NmapJob(key);
    res.sendStatus(201);
    nmapJob.run({ command, host, data });
    nmapJob.get().then(result => {
      store.add({
          key,
          host,
          command,
          timeStart,
          timeEnd: new Date().getTime(),
          value: result,
          status: 1
        });
      global.io.emit('task-executed', store);
    });
  } catch (err) {
    console.log("Error handling should be here: " + err);
    store.add({
      key,
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
