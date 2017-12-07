import {fork} from 'child_process';
import path from 'path';

export default class IJob {
  constructor(name, key, data='') {
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
    this.data = data;
  }

  onData(data) {
    console.log(data);
  }
  onFinished() {
    console.log("finished");
  }

  run(params) {
    this.state.initial = false;
    const cParams = this.configure(Object.assign(params, {command: this.name, key: this.key}));
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
        this.onData(msg.data);
      }
      if (msg.finished) {
        this.onFinished();
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
    this.data = null;
    this.process.send({ terminate: true });
  }
}
