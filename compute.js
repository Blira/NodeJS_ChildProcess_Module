const longComputation = () => {

  for (let index = 1; index <= 500000; index++) {
    const countObj = Buffer.from(JSON.stringify({
      messageType: 'newCount',
      count: `${process.pid} - ${index}`
    }));
    process.send(countObj);
  }

  return Buffer.from(JSON.stringify({
    messageType: 'endMsg',
    message: `${process.pid} - Child Process on the block`
  }));
};

process.on('message', (msg) => {
  const endMsg = longComputation();
  process.send(endMsg);
});