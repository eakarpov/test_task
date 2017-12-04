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
   return null;
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
