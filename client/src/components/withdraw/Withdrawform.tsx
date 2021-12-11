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


export default function useEffectAsync(effect:any, inputs:any) {
  useEffect(() => {
      effect()
  }, inputs)
}

const formatter = new Intl.NumberFormat('en-us', {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
})

const formatBalance = (balance: BigNumber | undefined) =>
  formatter.format(parseFloat(formatEther(balance ?? BigNumber.from('0'))))


const formatDecimal=(num:string, decimal:number)=> {
  num = num.toString()
  const index = num.indexOf('.')
  if (index !== -1) {
      num = num.substring(0, decimal + index + 1)
  } else {
      num = num.substring(0)
  }
  return parseFloat(num).toFixed(decimal)
}  

interface StatusBlockProps {
  color: string
  text: string
  icon: ReactElement
}

interface IdBlockProps {
  color: string
  text: string
  hidden:boolean
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


const IdBlock = ({ color, text,hidden }: IdBlockProps) => (
  <InformationRow3
    hidden={hidden}
    layout
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    key={text}
  >
    <div style={{ color: color, textAlign: 'center'}}>{text}</div>
  </InformationRow3>
)


interface ShowRemainbalanceProps{
  transaction: TransactionStatus
  Id:string
  check_payment: (id:string) =>Promise<string[]>

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

export const ShowRemainbalance=({ transaction , Id,check_payment}: ShowRemainbalanceProps) => {

  const [showTransactionStatus, setShowTransactionStatus] = useState(false)
  const [timer, setTimer] = useState(
    setTimeout(() => {
      void 0
    }, 1)
  )
  const [balance,setbalance]=useState("0")
  const [hidden,sethidden]=useState(true)

  useEffectAsync(async () => {
    setShowTransactionStatus(true)
    clearTimeout(timer)
    if (transaction.status != 'Mining')
     {setTimer(setTimeout(() => setShowTransactionStatus(false), 10000))
      const result=await check_payment(Id)
      setbalance(result[6])
      sethidden(false)
    }
  }, [transaction])

  return (
    <AnimationWrapper>
      <AnimatePresence initial={false} exitBeforeEnter>
        {showTransactionStatus && transaction.status === 'Success' && (
          <IdBlock
            hidden={hidden}
            color="black"
            text= {"Withdraw successfully,Current payment balance is "+formatDecimal(formatEther(balance),5).toString()+" ETH"}
          />
        )}
      </AnimatePresence>
    </AnimationWrapper>
  )

}

interface InputComponentProps {
  send: (id: string,withdrawAmount:string ) => void
  check_payment: (id:string) =>Promise<string[]>
  ticker: string
  transaction: TransactionStatus
}

const InputComponent = ({ ticker, transaction, send ,check_payment}: InputComponentProps) => {
  const { account } = useEthers()
  const [id, setid] = useState('0')
  const [withdrawAmount,setwithdrawAmount]=useState("0")
  const [disabled, setDisabled] = useState(false)


  const onClick =() => {
    if (Number(withdrawAmount) > 0 && id!="") {
      setDisabled(true)
      send(id,withdrawAmount)
    }
  }

  useEffectAsync(async() => {
    if (transaction.status != 'Mining') {
      setDisabled(false)
      setid('0')
      setwithdrawAmount('0')
    }
  }, [transaction])

  return (
    <Withdrawbox>
    <InputRow>
        <LabelRow>
        <Label htmlFor={`id`}>ID</Label>
        </LabelRow>
        <Input
        id={`id`}
        type="text"
        value={id}
        onChange={(e) => {
          const { value } = e.target
          const reg=/^[1-9]\d*$/
          if(reg.test(value) ||value=="0"||value==""){
          setid(e.currentTarget.value)
          }
        }}
        disabled={disabled}
        placeholder="Please input the payment ID"
      />
      <LabelRow>
      </LabelRow>
      <LabelRow>
      <Label htmlFor={`withdrawAmount`}>Withdraw Amount</Label>
      </LabelRow>
      <Input
        id={`withdrawAmount`}
        type="number"
        vertical-align="middle"
        text-align="center"
        value={withdrawAmount}
        onChange={(e) => {
          const { value } = e.target
          const reg=/^\d+(\.\d+)?$/ 
          if(reg.test(value) ||value=="0"||value==""){
          setwithdrawAmount(e.currentTarget.value)
          }
        }}
        disabled={disabled}
        placeholder="Please input the amount you want to withdraw"
      />
      <SmallButton disabled={!account || disabled} onClick={onClick}>
        Withdraw
      </SmallButton>  

    </InputRow>
    <ShowRemainbalance transaction={transaction} Id={id} check_payment={check_payment} />
    </Withdrawbox>  
    
  )
}

interface TransactionFormProps {
  send: (id: string,withdrawAmount:string ) => void
  check_payment: (id:string) =>Promise<string[]>
  title: string
  ticker: string
  transaction: TransactionStatus
}

export const WithdrawForm = ({  send, check_payment,title, ticker, transaction }: TransactionFormProps) =>{
    const [id, setid] = useState('0')
    const [disabled, setDisabled] = useState(false)
    const [balance,setbalance]= useState('0')
    const [hidden, setHidden] = useState(true)
    const onClick = async() => {
          if (id!=""){
          setDisabled(false)
          const a=await  check_payment(id)
          console.log(a)
          setbalance(a[6])
          setHidden(false)
        }
    }
      
    

    return(
  <SmallContentBlock>
    <TitleRow>
      <CellTitle>{title}</CellTitle>
      <Label1 htmlFor={`checkbalance`}>Payment Balance</Label1>
      <Input1
        id={`checkbalance`}
        type="text"
        vertical-align="middle"
        text-align="center"
        value={id}
        onChange={(e) => {
          const { value } = e.target
          const reg=/^[1-9]\d*$/
          if(reg.test(value) ||value=="0"||value==""){
          setid(e.currentTarget.value)
          }
        }}
        disabled={disabled}
        placeholder="ID"
      />
      <SmallButton1 disabled={ disabled} onClick={onClick}>
        Check
      </SmallButton1>  
      < Balancebox hidden={hidden}>{formatDecimal(formatEther(balance),5)}&emsp; &emsp; &nbsp; ETH</Balancebox>

    </TitleRow>
   { <InputComponent ticker={ticker} transaction={transaction} send={send}   check_payment={check_payment}  /> }
    <StatusAnimation transaction={transaction} />
 
  </SmallContentBlock>
    )
}

const SmallButton = styled(Button)`
  margin:15px 0 0 265px;
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
const SmallButton1 = styled(Button)`
  margin:0px 0 0 0px;
  justify-content: center;
  min-width: 20px;
  height: unset;
  padding:  1px;
  font-size:10px;
  display:inline;
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
const Input1 = styled.input`
  height: 25px;
  width: 60px;
  margin:0 10px 0 0;
  border: 10;
  border-radius: ${BorderRad.m};
  text-align:center;
  align-items: center;
  display:inline;
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
  font-size: 25px;
  width: 113px;
  display:inline;
  align-items: center;
  padding: 0 0 0 10px;
  
`

const InputRow = styled.div`

  padding: 0 24px 0 24px;
  color: ${Colors.Gray['600']};
  align-items: center;
  border:0;
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
const Label1 = styled.label`
  font-weight: 500;
  font-size:15px;
  color: ${Colors.Black['900']};
  margin: 0 10px 0 310px;
`


const TitleRow = styled.div`
  align-items: baseline;
  justify-content: space-between;
  border-bottom: ${Colors.Gray['300']} 1px solid;
  padding: 0;
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

const InformationRow3 = styled(motion.div)`
  height: 80px;
  font-size: 18px;
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
const Balancebox= styled.div`
font-size: 10px;
margin: 0 0 0px 82%;
`

const Withdrawbox=styled.div`


`