export type EthAddressConfig = {
  mainnet: string
  goerli: string
  ropsten: string
}

export type EthChainIdConfig = {
  mainnet: number
  goerli: number
  ropsten: number
}

export type EtherNetwork = 'mainnet' | 'goerli'

export type EtherConfigSet = {
  mainnet: string
  goerli: string
  ropsten: string
}

export type MoralisStructure = {
  url: string
  apiKey: string
}

export const ETH_BRIDGE_ADDRESS: EthAddressConfig = {
  mainnet: '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B',
  goerli: '0x706abc4E45D419950511e474C7B9Ed348A4a716c',
  ropsten: '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550',
}

export const ETH_TOKEN_BRIDGE_ADDRESS: EthAddressConfig = {
  mainnet: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585',
  goerli: '0xf890982f9310df57d00f659cf4fd87e65aded8d7',
  ropsten: '0x0290FB167208Af455bB137780163b7B7a9a10C16',
}

export const CHAIN_ID_ETH: EthChainIdConfig = {
  mainnet: 1,
  goerli: 5,
  ropsten: 3,
}

export const MORALIS_INFO: MoralisStructure = {
  url: 'https://deep-index.moralis.io/api/v2',
  apiKey: 'N6yeIUl1FxCPZWbXyxLHWPAjSr6ahQeJTX3d19pSKCwHsLCzpWE7z1hilon4xDOd',
}

export const INFURA_API_KEY: String = '5eb1b92f2065414d9dd21858fac54257'

export const INFURA_API_HTTP_URL: EtherConfigSet = {
  mainnet: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
  goerli: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
  ropsten: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
}

export const INFURA_API_WSS_URL: EtherConfigSet = {
  mainnet: `wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}`,
  goerli: `wss://goerli.infura.io/ws/v3/${INFURA_API_KEY}`,
  ropsten: `wss://ropsten.infura.io/ws/v3/${INFURA_API_KEY}`,
}
