import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { Page } from './components/base/base'
import { TopBar } from './components/TopBar'
import { GlobalStyle } from './global/GlobalStyle'
import { Createpayment } from './pages/Createpayment'
import { Checkpayment } from './pages/Checkpayment'
import { Withdraw } from './pages/Withdraw'
import { NotificationsList } from './components/Transactions/History'
import { Pay } from './pages/pay'
import {Cancelpayment } from './pages/Cancel'
import {Findpayment} from './pages/findpayment'
export function App() {
  return (
    <Page>
      <GlobalStyle />
      <BrowserRouter>
        <TopBar />
        <Switch>
          <Route exact path="/createpayment" component={Createpayment} />
          <Route exact path="/checkpayment" component={Checkpayment} />
          <Route exact path="/pay" component={Pay} />
          <Route exact path="/withdraw" component={Withdraw} />
          <Route exact path="/cancel" component={Cancelpayment} />
          <Route exact path="/findpayment" component={Findpayment} />
          <Redirect exact from="/" to="/createpayment" />
        </Switch>
      </BrowserRouter>
      <NotificationsList />
    </Page>
  )
}
