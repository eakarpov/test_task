import store from "./list";
import context from './context';
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
          data,
          status: 1
        });
        context.add({key, job });
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
      data: undefined,
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

export function create(req, res) {
  let command, host, timeStart, key, service;
  try {
    const data = JSON.parse(req.query.data);
    command = req.query.command;
    host = req.query.host;
    key = req.query.key;
    service = req.query.service;
    data.service = service;
    store.add({
      key,
      host,
      command,
      data,
      timeStart: undefined,
      timeEnd: undefined,
      value: undefined,
      status: 3
    });
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
}

export function start(req, res) {
  try {
    const key = req.query.key;
    const elem = store.get(key);
    if (elem.status === 3) {
    const timeStart = new Date().getTime();
    let job;
    switch (elem.command) {
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
      context.add({ key, job });
      res.sendStatus(201);
      job.run({host: elem.host, data: elem.data});
      job.get().then(result => {
        if (result !== null) {
          elem.value = result;
          elem.status = 1;
        } else {
          elem.status = 4;
        }
        global.io.emit('task-executed', store);
      });
    }
    } else {
      res.sendStatus(400);
    }
  } catch(e) {
    console.log(e);
    res.send(e);
  }
}

export function stop(req, res) {
  try {
    const key = req.query.key;
    const job = context.get(key).job;
    job.terminate();
    res.sendStatus(200);
  } catch(e) {
    console.log(e);
    res.send(e);
  }
}
