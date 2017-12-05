import IJob from './IJob';
import parser from 'xml2json';
import { DOMParser } from 'xmldom';

export default class NmapJob extends IJob {
  constructor(key) {
    super("nmap", key);
  }

  configure(params) {
    return {
      host: params.host,
      command: params.command,
      params: params.data.params
    }
  }

  onData(data) {
    if (data.type === 'Buffer') {
      const buffer = data.data;
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
}
