import { exec } from "child_process";
import store from "./list";

export function launch(req, res) {
  let command, commentary, timeStart;
  try {
    const checked = (req.query.checked == 'true');
    command = req.query.command;
    commentary = req.query.commentary;
    timeStart = new Date().getTime();
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        store.add({
          commentary,
          command,
          timeStart,
          timeEnd: new Date().getTime(),
          value: "Command failed",
          status: -1
        });
        res.send(store);
      } else {
        store.add({
          key: store.size(),
          commentary,
          command,
          timeStart,
          timeEnd: new Date().getTime(),
          value: stdout,
          status: 1
        });
        if (checked) {
          setTimeout(() => res.send(store), 10000);
        } else {
          res.send(store);
        }
      }
    });
  } catch (err) {
    console.log("Error handling should be here: " + err);
    store.add({
      commentary,
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