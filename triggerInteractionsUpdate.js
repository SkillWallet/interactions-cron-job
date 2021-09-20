const partnersRegistryAddress = '0x67A28F057C431c901f62f3F162e045589C442e46';
var ethers = require('ethers');

var partnersRegistryAbi = require('./abis/PartnersRegistry.json')
  .abi

var partnersAgreementAbi = require('./abis/PartnersAgreement.json')
  .abi
var communityAbi = require('./abis/ICommunity.json')
  .abi
const fs = require("fs");

const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc-mumbai.maticvigil.com/'
);

function mnemonic() {
  try {
    return fs.readFileSync("./mnemonic.txt").toString().trim();
  } catch (e) {
    throw new Error("Error: no mnemonic!")
  }
}

// Wallet connected to a provider
const senderWalletMnemonic = ethers.Wallet.fromMnemonic(
  mnemonic(),
  "m/44'/60'/0'/0/0"
);

let signer = senderWalletMnemonic.connect(provider)

const partnersRegistryContract = new ethers.Contract(
  partnersRegistryAddress,
  partnersRegistryAbi,
  signer,
)

// returns all partners agreements
async function getPartnerAgreementsAddresses() {
  const partnerAgreements = await partnersRegistryContract.getPartnerAgreementAddresses();
  return partnerAgreements;
}

async function getCommunityAddress(partnersAgreement) {
  const partnersAgreementContract = new ethers.Contract(
    partnersAgreement,
    partnersAgreementAbi,
    signer,
  );

  return await partnersAgreementContract.communityAddress();
}

async function getCommunityMembers(communityAddress) {
  const community = new ethers.Contract(
    communityAddress,
    communityAbi,
    signer,
  );

  return await community.getMemberAddresses();
}


async function queryForNewInteractions(agreement, memberAddress) {

  const partnersAgreementContract = new ethers.Contract(
    agreement,
    partnersAgreementAbi,
    signer,
  );
  var options = { gasPrice: 1000000000000, gasLimit: 1000000 };
  partnersAgreementContract.queryForNewInteractions(memberAddress, options);
}

async function interactionsJob() {
  const agreementsAddresses = await getPartnerAgreementsAddresses();
  console.log(agreementsAddresses);
  // agreementsAddresses.forEach(async agreement => {
    // const agreement = agreementsAddresses[0];
    // console.log(agreement)
    const agreement = '0xcEf46F78182DF2a21bEFDA522A5F65fE4d0faA3E';
    const community = await getCommunityAddress(agreement);
    console.log('community', community)
    const members = await getCommunityMembers(community);
    console.log('members', members)

    console.log(agreement, community, members);
    members.forEach(member => queryForNewInteractions(agreement, member));
  // });
}


// This allows the function to be exported for testing
// or for running in express
module.exports.interactionsJob = interactionsJob