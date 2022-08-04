export enum PriceImpact {
  goodSwap = 0.01, // price impact lower than 1%
  acceptableSwap = 0.05, // price impact lower than 5%
}

export const HOMEPAGE_TABS: Record<string, string> = {
  Swap: 'swap',
  Pools: 'pools',
}
