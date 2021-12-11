import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import React from 'react'
import {   useContractCall } from '@usedapp/core'
import { FindPaymentForm } from './FindPaymentForm'

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



export async function useFindpayment(address:string| Falsy):Promise<string[]>{  
    
const paymentcontract= new web3.eth.Contract(web3abi, createpaymentAddress)
  const result= await paymentcontract.methods.fetch_paymentsbook(address).call()
  console.log(result)
  return result
}



export const Find_Payment = () => {

       return(          
      <FindPaymentForm  find_payment={useFindpayment} title="Input your address"      />

    )


}


