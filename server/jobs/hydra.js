import { spawn } from 'child_process';

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
    const ps = spawn(params.command, [params.host, params.service, ...params.params.split(' ')]);
    ps.stdout.on('data', (data) => {
      process.send({ data });
    });
    ps.on('error', (error) => process.send({ data: error }));
    ps.stderr.on('data', (error) => process.send({ data: error }));
    ps.on('exit', () => {
      process.send({ finished: true });
      ps.kill();
    })
  }
  if (msg.data) {
    process.send({ data: msg.data });
  }
  if (msg.finished) {
    process.send({ finished: true });
  }
});