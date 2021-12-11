import { formatEther } from '@ethersproject/units'
import React, { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { TextBold } from '../../typography/Text'
import { ContentBlock } from '../base/base'
import { Button } from '../base/Button'
import { BorderRad, Colors } from '../../global/styles'
import { BigNumber } from 'ethers'
import { AnimatePresence, motion } from 'framer-motion'
import Web3 from 'web3'

const formatter = new Intl.NumberFormat('en-us', {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
})

const formatBalance = (balance: BigNumber | undefined) =>
  formatter.format(parseFloat(formatEther(balance ?? BigNumber.from('0'))))


interface InputComponentProps {
    find_payment: (id:string) =>Promise<string[]>
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







const InputComponent = ({find_payment}: InputComponentProps) => {
  const [address, setaddress] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [id,setid]=useState("")
 

  const onClick = async () => { 
     if (address!=""){ 
        const reg=/^0x[a-fA-F0-9]{40}$/
        if(reg.test(address)){
            const caddress=Web3.utils.toChecksumAddress(address)
            const a=await  find_payment(caddress)
            setid(a.join(","))  
            setHidden(false)
        }


  }
}


  return (
    <Contentbox>
    <InputRow>
        <LabelRow>
        <Label htmlFor={`address`}>address</Label>
        </LabelRow>
        <Input
        id={`address`}
        type="text"
        value={address}
        onChange={(e) => {
          const { value } = e.target
          setaddress(e.currentTarget.value)          
        }}
        disabled={disabled}
        placeholder="Please input a valid address"
      />
     
      <SmallButton disabled={disabled} onClick={onClick}>
        Submit
      </SmallButton>   

    </InputRow>
    <Paymentbox hidden={hidden}> 
    <LabelRow1 >
        <Label1 htmlFor={`paymentid`}>Payment you created</Label1>
    </LabelRow1>
    <PaymentID >
        Payment ID:{id}
    </PaymentID>
    </Paymentbox>
    </Contentbox>
   
    
  )
}

interface FindPaymentFormProps {
 find_payment: (id:string) =>Promise<string[]>,
  title: string
}

export const FindPaymentForm = ({ find_payment,title}: FindPaymentFormProps) => (
  <SmallContentBlock>
    <TitleRow>
      <CellTitle>{title}</CellTitle>
      
    </TitleRow>
   { <InputComponent find_payment={find_payment} /> }
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
const LabelRow1 = styled.div`
display: flex;
justify-content: center;
margin: 5px 0px 12px 0;

`
const Label = styled.label`
  font-weight: 900;
  font-size:30px;
  color: ${Colors.Black['900']};
`
const Label1 = styled.label`
  font-weight: 500;
  font-size:20px;
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
padding: 15px 100px 30px 100px;
color: ${Colors.Gray['600']};
align-items: center;
border:0
overflow: hidden;


`

const PaymentID= styled.div`
display: flex;
justify-content: center;
text-align: center;
padding: 5px;




`
