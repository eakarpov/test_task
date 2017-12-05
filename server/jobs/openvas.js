import { exec } from 'child_process';
import {Parser} from 'xml2js';

const parser = new Parser();
const parse = (str) => new Promise((resolve, reject) => {
  parser.parseString(str, (err, data) => {
    if (err) reject(err);
    resolve(data);
  });
});

const check = (command) => {
  exec(command, (err, stdout, stderr) => {
    if (err) console.log(err.message);
    if (stderr !== '') console.log(stderr);
    parse(stdout.toString()).then(out => {
      const progress = out.get_tasks_response.task[0].progress[0];
      const percent = typeof progress === 'string' ? progress : progress._;
      const status = out.get_tasks_response.task[0].status;
      if (status === 'DONE') {
        console.log('DONE!');
      } else {
        process.send({ data: percent })
        run(command);
      }
    });
  });
};

const run = (command) => {
  setTimeout(() => check(command), 1000);
};

process.on('message', (msg) => {
  console.log('Message from parent:', msg);
  if (msg.terminate) {
    process.send({ terminated: true });
  }
  if (msg.start) {
    const params = {};
    process.argv.forEach((el, i) => {
      if (i > 1) {
        const [a, ...b] = el.split(' ');
        if (b.length === 0) params[a] = b[0];
        else params[a] = b.join(' ');
      }
    });
    const template = `omp -h ${params.host} -u ${params.user} -w ${params.password} -X '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`;
    const targetCommand = `${template}<create_target><name>${params.key}</name><hosts>${params.host}</hosts></create_target>'`;
    const scanner = '08b69003-5fc2-4037-a479-93b440211c73';
    let target;
    exec(targetCommand, (err, stdout, stderr) => {
      parse(stdout.toString()).then(response => {
        target = response.create_target_response.$.id;
        const config = '8715c877-47a0-438d-98a3-27c7a6ab2196';
        const taskCommand = `${template}<create_task><name>Scan Webserver</name><comment>Hourly scan of the webserver</comment><config id="${config}" /><target id="${target}" /><scanner id="${scanner}" /></create_task>'`;
        exec(taskCommand, (err, stdout, stderr) => {
          parse(stdout.toString()).then(response => {
            const task = response.create_task_response.$.id;
            const command = `${template}<start_task task_id="${task}"/>'`;
            exec(command, (err, stdout, stderr) => {
              parse(stdout.toString()).then(response => {
                const status = response.start_task_response.$.status;
                console.log(`STATUS: ${status}`);
                if (status === '202') {
                  const commandCheck = `${template}<get_tasks task_id="${task}" details="1"/>'`;
                  run(commandCheck);
                }
              });
            });
          });
        });
      });
    });
  }
});