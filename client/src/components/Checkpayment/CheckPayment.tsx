import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import React from 'react'
import {   useContractCall } from '@usedapp/core'
import { CheckPaymentForm } from './CheckPaymentForm'

import abi from '../../abi/createpayment.json'
import type { Falsy } from '@usedapp/core/dist/esm/src/model/types'

const createpaymentInterface = new utils.Interface(abi)
const createpaymentAddress='0x66f000056f2e881351289D9c91D17667c3126a80'
import Web3 from 'web3'
const infuraapikey="646dc0f33d2449878b28e0afa25267f6"
const rpcstring = 'https://ropsten.infura.io/v3/'+infuraapikey
const rpcweb3 = new Web3(new Web3.providers.HttpProvider(rpcstring))
const web3=rpcweb3
const web3abi = require('../../abi/createpaymentweb3abi.js')


// export function useShowpayment(id:string| Falsy): string | undefined{  
    
//     const [a]= useContractCall(
//      id && {
//          abi: createpaymentInterface, // ABI interface of the called contract
//          address: createpaymentAddress, // On-chain address of the deployed contract
//           method: "fetch_payment", // Method to be called
//           args: [utils.parseEther(id)], // Method arguments
//         }
//     ) ?? []
//    return a  
// }

export async function useShowpayment(id:string| Falsy):Promise<string[]>{  
    
const paymentcontract= new web3.eth.Contract(web3abi, createpaymentAddress)
  const result= await paymentcontract.methods.fetch_payment(id).call()
  console.log(result)
  return result
}



export const Check_Payment = () => {

       return(          
      <CheckPaymentForm  check_payment={useShowpayment} title="Input your payment ID"      />

    )


}


// export const Check_Payment = () => {
//   const { account } = useEthers()
//   const etherBalance = useEtherBalance(account)

//   const { state, send } = useContractFunction(contract, 'createpayment', { transactionName: 'createpayment' })

//   const createpayment = (total_amount: string,name:string,payer_list:string) => {
//     send (name,utils.parseEther(total_amount),[payer_list])
//   }

//   return (
//     <TransactionForm balance={etherBalance} send={createpayment} title="New payment" ticker="ETH" transaction={state} />
//   )
// }

