const advanceBlock = async () => new Promise((resolve, reject) => {
  web3.currentProvider.send(
    { jsonrpc: '2.0', method: 'evm_mine', id: Date.now() },
    (err, res) => err ? reject(err) : resolve(res),
  )
});

module.exports = {
  advanceBlock,
};
