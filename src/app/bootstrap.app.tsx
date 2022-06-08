import { Provider } from 'react-redux'
import {
  WalletProvider,
  UIProvider,
  AccountProvider,
  PoolProvider,
  MintProvider,
} from '@senhub/providers'

import View from 'app/view'

import model from 'app/model'
import configs from 'app/configs'

import 'app/static/styles/dark.less'
import 'app/static/styles/light.less'
import 'app/static/styles/index.less'

const {
  manifest: { appId },
} = configs

export const Page = () => {
  return (
    <UIProvider appId={appId} antd>
      <MintProvider>
        <PoolProvider>
          <AccountProvider>
            <WalletProvider>
              <Provider store={model}>
                <View />
              </Provider>
            </WalletProvider>
          </AccountProvider>
        </PoolProvider>
      </MintProvider>
    </UIProvider>
  )
}

export * from 'app/static.app'
