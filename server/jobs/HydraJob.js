import IJob from './IJob';

export default class HydraJob extends IJob {
	constructor(key, service) {
	// Array.prototype.min = function() {
	// 	let min = this[0];
 //    	this.forEach(el => {
 //    		if (el[0] < min[0]) min = el
 //    	});
 //    	return min;
	// };
	// function printer() {
 //  		let arr = [];

 //  		return function print(elem) {
 //  			arr.push(elem);
 //  			if (arr.length === 3) {
 //  				const min = arr.min();
 //  				arr = [];
 //  				console.log(`${min[0]/min[1]*100}%`);
 //  			}
 //  		}
 //  	}
		super("hydra", key, []);
		this.service = service;
		// this.printer = printer();
	}

  configure(params) {
    return {
      service: this.service,
      host: params.host,
      command: params.command,
      params: params.data.params
    }
  }

  onFinished() {
  	super.onFinished();
  	console.log(this.data);
  	this.data = JSON.stringify(this.data); 
  }

  onData(data) {
  	if (data.type === 'Buffer') {
      const buffer = data.data;
      const buf = Buffer.from(buffer);
      const str = buf.toString();
      if (str.includes('Restorefile')) {
      	console.log('Restoring...');
      } else if (str.includes('DATA')) {
      	// console.log(str);
      } else if (str.includes('ATTEMPT')) {
      	const reg = /(\d+) of (\d+)/;
      	const a = str.match(reg);
      	// this.printer([a[1], a[2]]);
      	global.io.emit('task-progress', {
            job: this.key,
            task: 'Scanning',
            tasks: 1,
            taskId: 1,
            percent: (a[1]/a[2]*100).toFixed(2),
          });
      	console.log(`${a[1]/a[2]*100}%`);
  	} else {
  		const line = str.trim();
  		const reg = /^\[(\d+)\]\[(.+?)\]\s+host:\s+(.+?)\s+login:\s+(.*?)(\s+password:\s+(.*?))?$/;
  		if (reg.test(line)) {
  			const matched = reg.exec(line);
      		const [, port, service, host, user, , password] = matched;
      		this.data.push({port, service, host, user, password: password || '' });
  		} else {
  			// console.log('not');
  		}
  	}
  }
  }
}