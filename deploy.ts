import fs from 'fs';
import { Web3 } from 'Web3';

require('dotenv').config();

// Read smart contract data
const bytecode = fs.readFileSync('Voter_sol_Voter.bin', 'utf8');
const abiStr = fs.readFileSync('Voter_sol_Voter.abi', 'utf8');

const abi = JSON.parse(abiStr);

// Create Web3
const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.INFURA_URL as string)
);

// Add private key
const account = web3.eth.accounts.privateKeyToAccount(
  process.env.ACCOUNT_PRIVATE_KEY as string
);
web3.eth.accounts.wallet.add(account);

const voterContract = new web3.eth.Contract(abi);

// Deploying smart contract
console.log('Deploying the contract');
voterContract
  .deploy({
    data: '0x' + bytecode,
    arguments: [['option1', 'option2']] as unknown as undefined,
  })
  .send({
    from: account.address,
    gas: '1500000',
  })
  .on('transactionHash', (transactionHash) =>
    console.log(`Transaction Hash: ${transactionHash}`)
  )
  .on('confirmation', ({ confirmations, latestBlockHash, receipt }) => {
    console.log(`Confirmation number: ${confirmations}`);
    console.log(`Block number: ${receipt.blockNumber}`);
    console.log(`Block hash: ${receipt.blockHash}`);
  })
  .then((contractInstance) =>
    console.log(`Contract address: ${contractInstance.options.address}`)
  )
  .catch((err) => console.log(`Error: ${err}`));
