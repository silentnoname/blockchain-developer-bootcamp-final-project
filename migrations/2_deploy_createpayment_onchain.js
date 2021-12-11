const createpayment_onchain = artifacts.require("createpayment_onchain");
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
  await deployProxy(createpayment_onchain)
};