import IJob from './IJob';

export default class PingJob extends IJob {
  constructor() {
    super("ping");
  }
  configure(params) {
    return [`ttl ${params.ttl}`];
  }
}