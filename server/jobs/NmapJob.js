import IJob from './IJob';

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
}
