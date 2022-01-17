import { Provider } from 'react-redux'
import { Connection, PublicKey } from '@solana/web3.js'
import { JupiterProvider } from '@jup-ag/react-hook'
import {
  WalletProvider,
  UIProvider,
  AccountProvider,
  PoolProvider,
  MintProvider,
} from '@senhub/providers'

import PageView from 'app/page'
import WidgetView from 'app/widget'

import model from 'app/model'
import configs from 'app/configs'

import 'app/static/styles/dark.less'
import 'app/static/styles/light.less'
import 'app/static/styles/index.less'

const {
  manifest: { appId },
  sol: { node, cluster },
} = configs
const connection = new Connection(node)

export const Page = () => {
  return (
    <UIProvider appId={appId} antd>
      <MintProvider>
        <PoolProvider>
          <AccountProvider>
            <WalletProvider>
              <JupiterProvider
                connection={connection}
                cluster={cluster}
                userPublicKey={
                  new PublicKey('8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9')
                }
              >
                <Provider store={model}>
                  <PageView />
                </Provider>
              </JupiterProvider>
            </WalletProvider>
          </AccountProvider>
        </PoolProvider>
      </MintProvider>
    </UIProvider>
  )
}

export const widgetConfig: WidgetConfig = {
  size: 'small',
  type: 'solid',
}

export const Widget = () => {
  return (
    <UIProvider appId={appId} antd>
      <MintProvider>
        <PoolProvider>
          <AccountProvider>
            <WalletProvider>
              <JupiterProvider connection={connection} cluster={cluster}>
                <Provider store={model}>
                  <WidgetView />
                </Provider>
              </JupiterProvider>
            </WalletProvider>
          </AccountProvider>
        </PoolProvider>
      </MintProvider>
    </UIProvider>
  )
}
