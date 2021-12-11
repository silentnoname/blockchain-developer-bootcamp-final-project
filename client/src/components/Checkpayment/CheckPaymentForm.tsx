import { formatEther } from '@ethersproject/units'
import React, { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { TextBold } from '../../typography/Text'
import { ContentBlock } from '../base/base'
import { Button } from '../base/Button'
import { BorderRad, Colors } from '../../global/styles'
import { BigNumber } from 'ethers'
import { AnimatePresence, motion } from 'framer-motion'

const formatter = new Intl.NumberFormat('en-us', {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
})

const formatBalance = (balance: BigNumber | undefined) =>
  formatter.format(parseFloat(formatEther(balance ?? BigNumber.from('0'))))


interface InputComponentProps {
  check_payment: (id:string) =>Promise<any>
}

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







const InputComponent = ({check_payment}: InputComponentProps) => {
  const [id, setid] = useState('0')
  const [disabled, setDisabled] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [result, setResult] = useState <string| string[]>("")
  const [payer_list, setpayer_list] = useState("")
  const [paid_payer_list, setpaid_payer_list] = useState("")

  const onClick = async () => { 
     if (id!=""){
     const a=await  check_payment(id)
     setResult(a)   
     setHidden(false)
     setpayer_list(a[3].join(","))
     setpaid_payer_list((a[4].join(","))
     )
  }
}


  return (
    <Contentbox>
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
     
      <SmallButton disabled={disabled} onClick={onClick}>
        Submit
      </SmallButton>   

    </InputRow>
    <Paymentbox>
    <table  hidden={hidden} > 
    <caption>Payment Detail</caption>
      <tr>
      <td>Name: </td>
      <td> {result[0]} </td>
      </tr>
      <tr>
      <td>Receiver: </td>
      <td> {result[1]} </td>
      </tr>
      <tr>
      <td>Total Amount: </td>
      <td> {formatEther(result[2]?? BigNumber.from('0'))} ETH</td>
      </tr>
      <tr>
      <td>Payer List: </td>
      <td> {payer_list} </td>
      </tr>
      <tr>
      <td>Paid Payer List: </td>
      <td>  {paid_payer_list} </td>
      </tr>
      <tr>
      <td>Received: </td>
      <td> {formatEther(result[5]?? BigNumber.from('0'))} ETH</td>
      </tr>
      <tr>
      <td>Balance: </td>
      <td> {formatEther(result[6]?? BigNumber.from('0'))} ETH</td>
      </tr>
      <tr>
      <td>Canceled: </td>
      <td>{ String(result[7]) }</td>
      </tr>    
      <tr>
      <td>Finished: </td>
      <td>{ String(result[8]) }</td>
      </tr>  
      </table> 
    </Paymentbox>
    </Contentbox>
   
    
  )
}

interface CheckPaymentFormProps {
 check_payment: (id:string) =>Promise<string[]>,
  title: string
}

export const CheckPaymentForm = ({ check_payment,title}: CheckPaymentFormProps) => (
  <SmallContentBlock>
    <TitleRow>
      <CellTitle>{title}</CellTitle>
      
    </TitleRow>
   { <InputComponent check_payment={check_payment} /> }
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
  font-size: 18px;
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
const Contentbox=styled.div`


`

const Paymentbox= styled.div`
padding: 30px 100px 100px 100px;
display: flex;

`