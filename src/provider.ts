import { ethers } from 'ethers'

export interface UnsupportedNetwork {}
export class UnsupportedNetwork extends Error {
  __proto__: Error
  constructor(message?: string) {
    const trueProto = new.target.prototype
    super(message)
    this.__proto__ = trueProto
  }
}

export type NETWORK_NAME = 'dogechain' | 'dogechain-testnet'

export const NETWROK_ID: { [key: number]: NETWORK_NAME } = {
  568: 'dogechain-testnet',
  2000: 'dogechain',
}

export function getProviderById(networkId: number) {
  const netwrok = NETWROK_ID[networkId]
  return getProvider(netwrok)
}

export default function getProvider(network: NETWORK_NAME) {
  let RPC_URL: string
  let NETWORKISH: any

  switch (network) {
    case 'dogechain':
      RPC_URL = 'https://rpc.ankr.com/dogechain'
      NETWORKISH = {
        name: 'dogechain',
        chainId: 2000,
      }
      break
    case 'dogechain-testnet':
      RPC_URL = 'https://rpc-testnet.dogechain.dog'
      NETWORKISH = {
        name: 'dogechain-testnet',
        chainId: 568,
      }
      break
  }
  return new ethers.providers.StaticJsonRpcProvider(RPC_URL, NETWORKISH)
}
