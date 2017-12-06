import store from "./list";
import NmapJob from './jobs/NmapJob';
import OpenvasJob from './jobs/OpenvasJob';
import HydraJob from './jobs/HydraJob';

export function launch(req, res) {
  let command, host, timeStart, key, service;
  try {
    const data = JSON.parse(req.query.data);
    command = req.query.command;
    host = req.query.host;
    key = req.query.key;
    timeStart = new Date().getTime();
    let job;
    switch (command) {
      case 'nmap': {
        job = new NmapJob(key);
        break;
      }
      case 'openvas' : {
        job = new OpenvasJob(key);
        break;
      }
      case 'hydra': {
        service = req.query.service;
        job = new HydraJob(key, service);
        break;
      }
      default: job = null;
    }
    if (job === null) res.sendStatus(400);
    else {
      res.sendStatus(201);
      job.run({host, data});
      job.get().then(result => {
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
    }
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
