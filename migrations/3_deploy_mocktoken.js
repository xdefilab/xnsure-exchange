const MockTokenA = artifacts.require("MockTokenA");
const MockTokenB = artifacts.require("MockTokenB");

module.exports = function (deployer, network) {
  if (network === 'development') {
    deployer.deploy(MockTokenA);
    deployer.deploy(MockTokenB);
  }
};
