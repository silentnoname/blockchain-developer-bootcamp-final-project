import React from 'react'
import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { Container, ContentBlock, ContentRow, MainContent, Section, SectionRow } from '../components/base/base'
import { Label } from '../typography/Label'
import { TextInline } from '../typography/Text'
import { Title } from '../typography/Title'

import { AccountButton } from '../components/account/AccountButton'
import { Create_Payment } from '../components/CreatePayment/CreatePayment'



export function Createpayment() {
  const { account } = useEthers()
  const userBalance = useEtherBalance(account)


  return (
    <MainContent>
      <Container>
        <Section>
          <SectionRow>
            <Title>Create Payment</Title>
            <AccountButton />
          </SectionRow>
          <ContentBlock>
            {account && (
              <ContentRow>
                <Label>Account:</Label> <TextInline>{account}</TextInline>
              </ContentRow>
            )}
            <ContentRow>
            <Create_Payment />
            </ContentRow>
          </ContentBlock>
        </Section>
      </Container>
    </MainContent>
  )
}
