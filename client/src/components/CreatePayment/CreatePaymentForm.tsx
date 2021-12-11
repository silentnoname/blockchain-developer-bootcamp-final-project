import { formatEther } from '@ethersproject/units'
import { TransactionStatus, useEthers, transactionErrored } from '@usedapp/core'
import React, { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { TextBold } from '../../typography/Text'
import { ContentBlock } from '../base/base'
import { Button } from '../base/Button'
import { BorderRad, Colors } from '../../global/styles'
import { BigNumber } from 'ethers'
import { SpinnerIcon, CheckIcon, ExclamationIcon } from './Icons'
import { AnimatePresence, motion } from 'framer-motion'

const formatter = new Intl.NumberFormat('en-us', {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
})

const formatBalance = (balance: BigNumber | undefined) =>
  formatter.format(parseFloat(formatEther(balance ?? BigNumber.from('0'))))

interface StatusBlockProps {
  color: string
  text: string
  icon: ReactElement
}

interface IdBlockProps {
  color: string
  text: string
}



const StatusBlock = ({ color, text, icon }: StatusBlockProps) => (
  <InformationRow
    layout
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    key={text}
  >
    <IconContainer style={{ fill: color }}>{icon}</IconContainer>
    <div style={{ color: color, textAlign: 'center' }}>{text}</div>
  </InformationRow>
)

const IdBlock = ({ color, text }: IdBlockProps) => (
  <InformationRow2
    layout
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    key={text}
  >
    <div style={{ color: color, textAlign: 'center'}}>{text}</div>
  </InformationRow2>
)
interface ShowIdProps{
  transaction: TransactionStatus
}







export const ShowId= ({ transaction }: ShowIdProps) => {

  const [showTransactionStatus, setShowTransactionStatus] = useState(false)
  const [timer, setTimer] = useState(
    setTimeout(() => {
      void 0
    }, 1)
  )

  useEffect(() => {
    setShowTransactionStatus(true)
    clearTimeout(timer)

    if (transaction.status != 'Mining') setTimer(setTimeout(() => setShowTransactionStatus(false), 10000))
  }, [transaction])

  return (
    <AnimationWrapper>
      <AnimatePresence initial={false} exitBeforeEnter>
        {showTransactionStatus && transaction.status === 'Success'   &&transaction.receipt!=undefined && (
          <IdBlock
            color="black"
            text= {"Your payment id is "+  BigNumber.from(transaction.receipt.logs[0].topics[1])}
          />
        )}
      </AnimatePresence>
    </AnimationWrapper>
  )

}



interface StatusAnimationProps {
  transaction: TransactionStatus
}

export const StatusAnimation = ({ transaction }: StatusAnimationProps) => {
  const [showTransactionStatus, setShowTransactionStatus] = useState(false)
  const [timer, setTimer] = useState(
    setTimeout(() => {
      void 0
    }, 1)
  )

  useEffect(() => {
    setShowTransactionStatus(true)
    clearTimeout(timer)

    if (transaction.status != 'Mining') setTimer(setTimeout(() => setShowTransactionStatus(false), 5000))
  }, [transaction])

  return (
    <AnimationWrapper>
      <AnimatePresence initial={false} exitBeforeEnter>
        {showTransactionStatus && transactionErrored(transaction) && (
          <StatusBlock
            color={Colors.Red['400']}
            text={transaction?.errorMessage || ''}
            icon={<ExclamationIcon />}
            key={transaction?.chainId + transaction.status}
          />
        )}
        {showTransactionStatus && transaction.status === 'Mining' && (
          <StatusBlock
            color="black"
            text="Transaction is being mined"
            icon={<SpinnerIcon />}
            key={transaction?.chainId + transaction.status}
          />
        )}
        {showTransactionStatus && transaction.status === 'Success' && (
          <StatusBlock
            color="green"
            text="Transaction successful"
            icon={<CheckIcon />}
            key={transaction?.chainId + transaction.status}
          />
        )}
      </AnimatePresence>
    </AnimationWrapper>
  )
}

interface InputComponentProps {
  send: (total_amount: string,name:string,payer_list:string[]) => void
  ticker: string
  transaction: TransactionStatus
}

const InputComponent = ({ ticker, transaction, send }: InputComponentProps) => {
  const { account } = useEthers()
  const [total_amount, settotal_amount] = useState('0')
  const [name, setname] = useState("")
  const [payer_list, setpayer_list] = useState("")
  const [disabled, setDisabled] = useState(false)

  const onClick = () => {
    if (Number(total_amount) > 0 && typeof name == 'string' && (name!="")&& typeof payer_list == 'string' && (payer_list!="") ) {
      setDisabled(true)
      const payer_list_split =payer_list.split(',')
      send(total_amount,name,payer_list_split)
    }
  }

  useEffect(() => {
    if (transaction.status != 'Mining') {
      setDisabled(false)
      settotal_amount('0')
    }
  }, [transaction])

  return (
      
    <InputRow>
        <LabelRow>
        <Label htmlFor={`name`}>Name</Label>
        </LabelRow>
        <Input
        id={`name`}
        type="text"
        value={name}
        onChange={(e) => setname(e.currentTarget.value)}
        disabled={disabled}
        placeholder="Please input the payment name"
      />
      <LabelRow>
      <Label htmlFor={`amount`}>Amount</Label>
      </LabelRow>
      <Input
        id={`amount`}
        type="number"
        vertical-align="middle"
        text-align="center"
        step="0.01"
        min="0"
        value={total_amount}
        onChange={(e) => {
          const { value } = e.target
          const reg=/^\d+(\.\d+)?$/ 
          if(reg.test(value) ||value=="0"||value==""){
          settotal_amount(e.currentTarget.value)
          }
        }}
        disabled={disabled}
        placeholder="Please input the total amount of the payment"
      />
      <span>ETH</span>

      <LabelRow>
      <Label htmlFor={`amount`}>Payer List</Label>
      </LabelRow>
      <Input
        id={`payer_list`}
        type="text"
        vertical-align="middle"
        text-align="center"
        value={payer_list}
        onChange={(e) => setpayer_list(e.currentTarget.value)}
        disabled={disabled}
        placeholder="Should input like a,b,c"
      />
      <SmallButton disabled={!account || disabled} onClick={onClick}>
        Create
      </SmallButton>  

    </InputRow>

    
  )
}

interface TransactionFormProps {
  balance: BigNumber | undefined
  send: (total_amount: string,name:string,payer_list:string[]) => void
  title: string
  ticker: string
  transaction: TransactionStatus
}

export const TransactionForm = ({ balance, send, title, ticker, transaction }: TransactionFormProps) => (
  <SmallContentBlock>
    <TitleRow>
      <CellTitle>{title}</CellTitle>
      <BalanceWrapper>
        Your {ticker} balance: {formatBalance(balance)}
      </BalanceWrapper>
    </TitleRow>
   { <InputComponent ticker={ticker} transaction={transaction} send={send} /> }
    <StatusAnimation transaction={transaction} />
    <ShowId transaction={transaction} />
  </SmallContentBlock>
)

const SmallButton = styled(Button)`
  margin:15px 0 0 275px;
  justify-content: center;
  min-width: 95px;
  height: unset;
  padding: 8px 24px;

  &:disabled {
    color: ${Colors.Gray['600']};
    cursor: unset;
  }

  &:disabled:hover,
  &:disabled:focus {
    background-color: unset;
    color: unset;
  }
`

const Input = styled.input`
  height: 40px;
  width: 500px;
  margin:0 5px 5px 80px;
  padding: 0 24px 0 24px;
  border: 10;
  border-radius: ${BorderRad.m};
  text-align:center;
  align-items: center;
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: transparent auto 1px;
  }

  &:focus-visible {
    box-shadow: inset 0 0 0 2px ${Colors.Black['900']};
  }
`

const CellTitle = styled(TextBold)`
  font-size: 20px;
`

const InputRow = styled.div`

  padding: 0 24px 0 24px;
  color: ${Colors.Gray['600']};
  align-items: center;
  border:0
  overflow: hidden;
`


const FormTicker = styled.div`
  padding: 0 0px;
`

const LabelRow = styled.div`
  display: flex;
  justify-content: center;
  margin: 5px 0 12px 0;
`

const Label = styled.label`
  font-weight: 900;
  font-size:30px;
  color: ${Colors.Black['900']};
`

const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: ${Colors.Gray['300']} 1px solid;
  padding: 16px;
`

const BalanceWrapper = styled.div`
  color: ${Colors.Gray['600']};
  font-size: 14px;
`

const SmallContentBlock = styled(ContentBlock)`
  padding: 0;
`

const IconContainer = styled.div`
  margin-right: 15px;
  height: 40px;
  width: 40px;
  float: left;
`

const InformationRow = styled(motion.div)`
  height: 60px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: auto;
`
const InformationRow2 = styled(motion.div)`
  height: 80px;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: auto;
`



const AnimationWrapper = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  margin: 10px;
`
