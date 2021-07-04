const partnersRegistryAddress = '0x68565f98f7d565A3019ED6EB5dA921156Ff7ab10';
var ethers = require('ethers');

// var partnersRegistryAbi = require('./abis/PartnersRegistry.json')
//   .abi

// var partnersAgreementAbi = require('./abis/PartnersAgreement.json')
//   .abi

// const provider = new ethers.providers.JsonRpcProvider(
//   'https://rpc-mumbai.maticvigil.com/v1/9ca44fbe543c19857d4e47669aae2a9774e11c66'
//   // 'https://kovan.infura.io/v3/779285194bd146b48538d269d1332f20'
// );

// // Wallet connected to a provider
// const senderWallet = new ethers.Wallet(process.env.privateKey)

// let signer = senderWallet.connect(provider)

// const partnersRegistryContract = new ethers.Contract(
//   partnersRegistryAddress,
//   partnersRegistryAbi,
//   signer,
// )

// async function getPartnerAgreementsAddresses() {
//   const partnerAgreements = await partnersRegistryContract.getPartnerAgreementAddresses();
//   return partnerAgreements;
// }

async function updateInteractions() {
  // const agreementsAddresses = getPartnerAgreementsAddresses();
  // const communityAddress = await partnersRegistryContract.communityAddress();
  // const community = await communityContract.getMembers()
  // const createTx = await partnersRegistryContract.getInteractions(
  //   [] // SW holder addresses
  // );
  console.log('updateInteractions')
}


// This allows the function to be exported for testing
// or for running in express
module.exports.updateInteractions = updateInteractions