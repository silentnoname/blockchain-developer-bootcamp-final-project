import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import React from 'react'
import { useContractFunction, useEtherBalance, useEthers, useTokenBalance } from '@usedapp/core'

import { TransactionForm } from './CreatePaymentForm'

import abi from '../../abi/createpayment.json'

const createpaymentInterface = new utils.Interface(abi)
const createpaymentAddress='0x66f000056f2e881351289D9c91D17667c3126a80'
const contract = new Contract(createpaymentAddress, createpaymentInterface)

export const Create_Payment = () => {
  const { account } = useEthers()
  const etherBalance = useEtherBalance(account)

  const { state, send } = useContractFunction(contract, 'createpayment', { transactionName: 'createpayment' })

  const createpayment = (total_amount: string,name:string,payer_list:string[]) => {
    send (name,utils.parseEther(total_amount),payer_list)
  }

  return (
    <TransactionForm balance={etherBalance} send={createpayment} title="New payment" ticker="ETH" transaction={state} />
  )
}




