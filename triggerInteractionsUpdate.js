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


async function getImportedAddressesPerAgreement(agreementAddress) {

  const partnersAgreementContract = new ethers.Contract(
    agreementAddress,
    partnersAgreementAbi,
    signer,
  )

  const importedContracts = await partnersAgreementContract.getImportedAddresses();
  return importedContracts;
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


async function interactionsJob() {
  const agreementsAddresses = await getPartnerAgreementsAddresses();
  agreementsAddresses.forEach(async agreement => {
    const community = await getCommunityAddress(agreement);
    console.log('community', community)
    const members = await getCommunityMembers(community);
    const contractAddresses = await getImportedAddressesPerAgreement(agreement);
    const startBlock = 0;
    if (contractAddress && contractAddresses.length() > 0) {
      contractAddress.forEach(contract => {
        members.forEach(member => {
          getTxCountPerUserAndContractAddr(member, contractAddress,)
        });
      })
    }
    console.log('members', members)
    console.log(agreement, community, members);
    members.forEach(async member => {
      const amountOfInteractions = await getTxCountPerUserAndContractAddr(agreement, member);
      transferInteractionNFTs(amountOfInteractions)
    });
  });
}

const transferInteractionNFTs = async (partnersAgreement, userAddress, amountOfInteractions) => {
  const partnersAgreementContract = new ethers.Contract(
    partnersAgreement,
    partnersAgreementAbi,
    signer,
  );

  const transferTx = await partnersAgreementContract.transferInteractionNFTs(
    userAddress,
    amountOfInteractions
  );

  const transferTxResult = await transferTx.wait()
  const { events } = transferTxResult
  const transferedEventEmitted = events.find(
    (e) => e.event === 'Transfer',
  );

  if (transferedEventEmitted)
    console.log(`${userAddress} received ${amountOfInteractions} interactions!`);
}

const getTxCountPerUserAndContractAddr = async (userAddress, contractAddress, startBlock, chainID) => {
  const covalentAPIKey = ''
  let finished = false
  let pageNumber = 0
  let pageSize = 1000000000
  let txCount = 0;
  while (!finished) {
    const url = `https://api.covalenthq.com/v1/${chainID}
                /address/${userAddress}
                /transactions_v2
                /?&key=${covalentAPIKey}
                &no-logs=true&
                page-size=${pageSize}
                &page-number=${pageNumber}`
    const result = await axios.get(url)
    if (result.data.data.items.length > 0) {
      txCount += result.data.data.items.filter(
        (tx) =>
          tx.to_address &&
          tx.block_height > startBlock &&
          tx.to_address == contractAddress,
      ).length
    } else finished = true
    pageNumber++
  }
  return txCount;
}


// This allows the function to be exported for testing
// or for running in express
module.exports.interactionsJob = interactionsJob