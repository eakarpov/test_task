import IJob from './IJob';
import parser from 'xml2json';
import {exec} from 'child_process';

export default class OpenvasJob extends IJob {
  constructor(key) {
    super("openvas", key);
  }

  configure(params) {
    return {
      host: params.host,
      user: 'admin',
      password: 'admin',
      params: params.data.params
    }
  }
  run(params) {
    const check = (command) => {
      exec(command, (err, stdout, stderr) => {
        if (err) console.log(err.message);
        if (stderr !== '') console.log(stderr);
        console.log(parser.toJson(stdout.toString()));
        // start_task_response -> status_text, status, report_id when first
        if (stdout.indexOf('<status>Done</status>') !== -1) {
          console.log('DONE!');
        } else {
          console.log('IN PROCESS');
          run(command);
        }
      });
    };

    const run = (command) => {
      setTimeout(() => check(command), 1000);
    };

    super.run();
    const cParams = this.configure(Object.assign(params, {command: 'openvas'}));
    const template = `omp -h ${cParams.host} -u ${cParams.user} -w ${cParams.password} -X '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`;
    const targetCommand = `${template}<create_target><name>${this.key}</name><hosts>${cParams.host}</hosts></create_target>'`;
    const scanner = '08b69003-5fc2-4037-a479-93b440211c73';
    let target;
    exec(targetCommand, (err, stdout, stderr) => {
      const response = JSON.parse(parser.toJson(stdout.toString()));
      target = response.create_target_response.id;
      const config = '8715c877-47a0-438d-98a3-27c7a6ab2196';
      const taskCommand = `${template}<create_task><name>Scan Webserver</name><comment>Hourly scan of the webserver</comment><config id="${config}" /><target id="${target}" /><scanner id="${scanner}" /></create_task>'`;
      exec(taskCommand, (err, stdout, stderr) => {
        const response = JSON.parse(parser.toJson(stdout.toString()));
        const task = response.create_task_response.id;
        const command = `${template}<start_task task_id="${task}"/>'`;
        check(command);
      });
    });
  }
}
