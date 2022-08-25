import { Provider } from 'react-redux'
import {
  WalletProvider,
  AccountProvider,
  MintProvider,
  AntdProvider,
} from '@sentre/senhub'

import View from 'view'

import model from 'model'
import configs from 'configs'

import 'static/styles/dark.less'
import 'static/styles/light.less'
import 'static/styles/index.less'

const {
  manifest: { appId },
} = configs

export const Page = () => {
  return (
    <AntdProvider appId={appId}>
      <MintProvider>
        <AccountProvider>
          <WalletProvider>
            <Provider store={model}>
              <View />
            </Provider>
          </WalletProvider>
        </AccountProvider>
      </MintProvider>
    </AntdProvider>
  )
}

export * from 'static.app'
