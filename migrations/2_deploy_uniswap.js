const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const FeeToAddress = "0x0000000000000000000000000000000000000000";
const WETHAddress =  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

module.exports = function (deployer) {
  deployer.deploy(UniswapV2Factory, FeeToAddress).then(function() {
    return deployer.deploy(UniswapV2Router02, UniswapV2Factory.address, WETHAddress);
  });
};
