import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import React from 'react'
import { useContractFunction, useEtherBalance, useEthers, useTokenBalance } from '@usedapp/core'

import { TransactionForm } from './CancelPaymentForm'
import abi from '../../abi/createpayment.json'

const createpaymentInterface = new utils.Interface(abi)
const createpaymentAddress='0x66f000056f2e881351289D9c91D17667c3126a80'
const contract = new Contract(createpaymentAddress, createpaymentInterface)

export const Cancel_Payment = () => {
  const { account } = useEthers()
  const etherBalance = useEtherBalance(account)

  const { state, send } = useContractFunction(contract, 'cancelpayment', { transactionName: 'cancelpayment' })

  const cancelpayment = (id:string) => {
    send (id)
  }

  return (
    <TransactionForm balance={etherBalance} send={cancelpayment} title="Cancel Payment" ticker="ETH" transaction={state} />
  )
}


