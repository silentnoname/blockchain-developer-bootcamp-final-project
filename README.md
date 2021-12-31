# blockchain-developer-bootcamp-final-project
# Create payment on blockchain
## Public Ethereum account for NFT certificate
`0x211126674fEdE6fC82F1C2ad95F12BaE374EFC1d`
##  Create payment on blockchain work flow
1. Users can create their payment by submit name,total amount and payer list,the payment receiver will be themselves. Every payer should pay total amount/payer num. Eg: total amount 1 ETH,payer list: `a,b`. Every payer should pay 0.5 ETH.
2. Payment receiver can cancel the payment.
3. Payers can pay the payment by payment id and payer name.
4. After paid,payer name will appear to paid payer list.
5. Receiver can withdraw the money that payment received.
6. After all payers paid, the payment should be finished.
7. Everyone can get payment detail by payment id,receiver can get the payment id that he created.
## Directory structure
```
├── build  # Truffle build 
├── client  # frontend files
├── contracts # Truffle contracts  
├── migrations # Truffle migrations 
├── truffle-config.js # Truffle config
└── test # Truffle test
```
## Demo url
https://createpaymentonchain-ropsten.netlify.app current only support ropsten testnet


## Prerequisites
```
Truffle v5.4.23 (core: 5.4.23)
Node v16.13.1
ganache-cli 
yarn 1.22.17
npm 8.2.0
```
## Run project locally
### Run front end locally
1. `git clone https://github.com/silentnoname/blockchain-developer-bootcamp-final-project.git`
2. `cd blockchain-developer-bootcamp-final-project`
3. `cd client`
4. `yarn install` 
5. `yarn start` and open `http://localhost:8080/`

### deploy on other chain
1. `git clone https://github.com/silentnoname/blockchain-developer-bootcamp-final-project.git`
2. `cd blockchain-developer-bootcamp-final-project`
3. `npm install truffle-hdwallet-provider`
4. `npm install dotenv`
5. `npm install @openzeppelin/contracts-upgradeable`
6. `npm install @openzeppelin/truffle-upgrades`
7. create a `.env` file and obtain your `MNEMONIC`and `API`
8. Add your network config in `truffle-config.js`  `networks: { }`  
9. `sudo truffle migrate --network <Your network> `
10. Edit ` supportedChains :` in `client/src/index.tsx` 
11. change the `rpcstring` and `createpaymentAddress` in  `client/src/components/` all file`
12. `cd client`
13. `yarn install` 
14. `yarn start` and open `http://localhost:8080/`
15. `yarn build` to build the project

## Run smart contract unit tests
1. `git clone https://github.com/silentnoname/blockchain-developer-bootcamp-final-project.git`
2. run `ganache-cli`,the port should be `8545`
3. `cd blockchain-developer-bootcamp-final-project`
4. `npm install --save-dev @openzeppelin/truffle-upgrades`
5. `npm install @openzeppelin/contracts-upgradeable`
6. `npm install @openzeppelin/truffle-upgrades`
7. `sudo truffle test`
## Screencast
https://www.youtube.com/watch?v=iGtmJyhziQ4
