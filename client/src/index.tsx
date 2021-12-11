import React from 'react'
import ReactDOM from 'react-dom'
import { ChainId, DAppProvider } from '@usedapp/core'
import { App } from './App'

const config = {
  readOnlyChainId: ChainId.Ropsten,
  // readOnlyUrls: {
  //   [ChainId.Mainnet]: 'https://mainnet.infura.io/v3/3165a249c65f4198bf57200109b8fadf',
  // },
  supportedChains : [ChainId.Ropsten],
}

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
