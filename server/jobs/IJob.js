import { fork } from 'child_process';
import path from 'path';
import parser from 'xml2json';
import { DOMParser } from 'xmldom';

export default class IJob {
  constructor(name, key) {
    this.name = name;
    this.key = key;
    this.state = {
      completed: false,
      initial: true,
      error: false,
    };
    this.callback = () => void 0;
    this.Create = () => {
      return {
        getIsCompleted: () =>  this.state.completed,
        setIsCompleted: (p) => { this.state.completed = p; this.callback(this.state); },
        getHasError: () => this.state.error,
        setHasError: (p) => { this.state.error = p; this.callback(this.state); }
      };
    };
    this.emitter = this.Create();
    this.data = '';
  }

  run(params) {
    this.state.initial = false;
    const cParams = this.configure(params);
    const prms = Object.keys(cParams).map(el => `${el} ${cParams[el]}`);
    this.process = fork(path.resolve(__dirname, `./${this.name}.js`), prms);
    this.process.send({ start: true });
    this.process.on('message', (msg) => {
      if (msg.terminated) {
        this.process.kill();
        console.log(`${this.process.pid} killed - ${this.process.killed}`);
        setTimeout(() => this.emitter.setIsCompleted(true), 1000);
      }
      if (msg.data) {
        if (msg.data.type === 'Buffer') {
          const buffer = msg.data.data;
          const buf = Buffer.from(buffer);
          const str = buf.toString();
          if (str.includes('taskprogress')) {
            const doc = new DOMParser().parseFromString(str, 'text/xml');
            const progress = doc.getElementsByTagName('taskprogress');
            const json = parser.toJson(progress.toString());
            const obj = JSON.parse(json);
            if (obj.taskprogress) {
              global.io.emit('task-progress', {
                job: this.key,
                task: obj.taskprogress.task,
                tasks: 2,
                taskId: obj.taskprogress.task === 'Ping Scan' ? 1 : 2,
                percent: obj.taskprogress.percent,
              });
              console.log(`${this.key} - ${obj.taskprogress.task} - ${obj.taskprogress.percent}`);
            }
          }
          this.data += buf;
        } else {
          // console.log(msg.data);
        }
      }
      if (msg.finished) {
        console.log("finished");
        // console.log(parser.toJson(this.data));
        this.process.send({ terminate: true });
      }
    });
    return this.process;
  }

  get() {
    return new Promise((resolve, reject) => {
      this.callback = (state) => {
        if (state.error) reject('error');
        if (state.completed) resolve(this.data);
      }
    });
  }

  configure(params) {
    return params;
  }

  progress() {
    this.process.send({ progress: true });
  }

  terminate() {
    this.process.send({ terminate: true });
  }
}
