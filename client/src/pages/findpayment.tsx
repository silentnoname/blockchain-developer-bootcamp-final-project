import React from 'react'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { Container, ContentBlock, ContentRow,ContentRow1,ContentBlock1, MainContent, Section, SectionRow } from '../components/base/base'
import { Label } from '../typography/Label'
import { TextInline } from '../typography/Text'
import { Title } from '../typography/Title'
import { AccountButton } from '../components/account/AccountButton'
import { formatEther } from '@ethersproject/units'
import { Find_Payment } from '../components/Findpayment/FindPayment'

export function Findpayment() {
  const { account } = useEthers()
  const userBalance = useEtherBalance(account)

  return (
    <MainContent>
      <Container>
        <Section>
          <SectionRow>
            <Title>Find Payment</Title>
            <ContentBlock1>

            <AccountButton />           
            {userBalance && (
              <ContentRow1>
                <Label>balance:</Label> <TextInline>{parseFloat(formatEther(userBalance)).toFixed(4)}</TextInline> <Label>ETH</Label>
              </ContentRow1>
            )}
            </ContentBlock1>
          </SectionRow>
          <ContentBlock>
            
            <ContentRow>
            <Find_Payment />
            </ContentRow>
          </ContentBlock>
        </Section>
      </Container>
    </MainContent>
  )
}
