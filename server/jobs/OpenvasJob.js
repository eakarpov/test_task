import IJob from './IJob';

export default class OpenvasJob extends IJob {
  constructor(key) {
    super("openvas", key);
  }

  configure(params) {
    return {
      host: params.host,
      user: 'admin',
      password: 'admin',
      params: params.data.params,
      key: params.key,
    }
  }
  onData(data) {
    global.io.emit('task-progress', {
            job: this.key,
            task: 'Scanning',
            tasks: 1,
            taskId: 1,
            percent: data,
    });
    console.log(`${this.key} - PROGRESS - ${data}`);
  }
}
