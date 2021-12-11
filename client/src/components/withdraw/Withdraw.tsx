import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import React from 'react'
import { useContractFunction, useEtherBalance, useEthers, useTokenBalance } from '@usedapp/core'

import { WithdrawForm } from './Withdrawform'


import abi from '../../abi/createpayment.json'

const createpaymentInterface = new utils.Interface(abi)
const createpaymentAddress='0x66f000056f2e881351289D9c91D17667c3126a80'
const contract = new Contract(createpaymentAddress, createpaymentInterface)
import Web3 from 'web3'
import type { Falsy } from '@usedapp/core/dist/esm/src/model/types'
const infuraapikey="646dc0f33d2449878b28e0afa25267f6"
const rpcstring = 'https://ropsten.infura.io/v3/'+infuraapikey
const rpcweb3 = new Web3(new Web3.providers.HttpProvider(rpcstring))
const web3=rpcweb3
const web3abi = require('../../abi/createpaymentweb3abi.js')



export async function useShowpayment(id:string| Falsy):Promise<string[]>{  
    
  const paymentcontract= new web3.eth.Contract(web3abi, createpaymentAddress)
    const result= await paymentcontract.methods.fetch_payment(id).call()
    return result
  }


export const Withdrawfund = () => {
  const { account } = useEthers()
  const etherBalance = useEtherBalance(account)

  const { state, send } = useContractFunction(contract, 'withdraw', { transactionName: 'withdraw' })

  const withdraw = (id: string,withdrawAmount:string ) => {
    send (id,utils.parseEther(withdrawAmount))
  }

  return (
    <WithdrawForm send={withdraw} check_payment={useShowpayment} title="Withdraw" ticker="ETH" transaction={state} />
  )
}