import React from 'react'
import { formatEther } from '@ethersproject/units'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { Container, ContentBlock, ContentRow, MainContent, Section, SectionRow } from '../components/base/base'
import { Label } from '../typography/Label'
import { TextInline } from '../typography/Text'
import { Title } from '../typography/Title'

import { AccountButton } from '../components/account/AccountButton'
import { Paypayment } from '../components/Pay/Pay'



export function Pay() {
  const { account } = useEthers()
  const userBalance = useEtherBalance(account)


  return (
    <MainContent>
      <Container>
        <Section>
          <SectionRow>
            <Title>Pay</Title>
            <AccountButton />
          </SectionRow>
          <ContentBlock>
            {account && (
              <ContentRow>
                <Label>Account:</Label> <TextInline>{account}</TextInline>
              </ContentRow>
            )}
            {userBalance && (
              <ContentRow>
                <Label>Ether balance:</Label> <TextInline>{formatEther(userBalance)}</TextInline> <Label>ETH</Label>
              </ContentRow>
            )}
            <ContentRow>
            <Paypayment />
            </ContentRow>
          </ContentBlock>
        </Section>
      </Container>
    </MainContent>
  )
}
