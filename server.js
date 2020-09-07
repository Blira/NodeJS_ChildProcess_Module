const { fork } = require("child_process");
const EventEmitter = require('events');
const numCPUs = require('os').cpus().length;

const parentEmmiter = new EventEmitter();


const cps = numCPUs/2;
let ccps = cps;

parentEmmiter.on('cpEnd', () => {
  ccps--;
  if (ccps === 0) {
    console.timeEnd('processTime')
  }
})

console.time('processTime')

for (let index = 1; index <= cps; index++) {
  child();
}

async function child() {
  const emitter = new EventEmitter();

  const compute = fork("compute.js");

  compute.send("start");

  compute.on("message", (msg) => {

    const msgBuffer = Buffer.from(msg);
    const msgObj = JSON.parse(msgBuffer.toString());
    emitter.emit(msgObj.messageType, msgObj);
  });

  emitter.on('newCount', (msgObj) => {
    console.log(msgObj.count);
  })

  emitter.on('endMsg', (msgObj) => {
    console.log(msgObj.message);
    compute.emit('exit');
  })

  emitter.on('msg', (msg) => {
    console.log(msg);
  })


  compute.once('exit', () => {
    console.log(`${compute.pid} - Exiting...`);
    compute.kill();
    console.log(`${process.pid} - Child exited!`);
    parentEmmiter.emit('cpEnd');

  })
}