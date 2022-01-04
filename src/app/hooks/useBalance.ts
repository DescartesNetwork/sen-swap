import { useAccount, useWallet } from 'senhub/providers'

const useBalance = (accountAddress: string) => {
  const { accounts } = useAccount()
  const {
    wallet: { address: walletAddress, lamports },
  } = useWallet()
  if (accountAddress === walletAddress) return lamports
  const { amount } = accounts[accountAddress] || { amount: BigInt(0) }
  return amount
}

export default useBalance
