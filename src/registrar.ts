import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { getDcRegistrarControllerContract, getERC721DatastoreContract, getNamedRegistrarContract, getRegistryContract, getPublicResolverContract, getReverseRegistrarContract } from './contracts'
import { DcNSRegistry, DcRegistrarController, ERC721Datastore, NamedRegistrar, PublicResolver, ReverseRegistrar } from './abis/types'
import { namehash } from 'ethers/lib/utils'
import { BigNumber, ethers } from 'ethers'
import getProvider, { NETWORK_NAME } from './provider'

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider
  }
}

export default class Registrar {
  provider: StaticJsonRpcProvider
  registry: DcNSRegistry
  defaultResolver: PublicResolver
  namedRegistrar: NamedRegistrar
  dcRegistrarController: DcRegistrarController
  reverseRegistrar: ReverseRegistrar
  erc721Datastore: ERC721Datastore

  constructor(
    provider: StaticJsonRpcProvider,
    registryAddress: string,
    resolverAddress: string,
    namedRegistrarAddress: string,
    dcRegistrarControllerAddress: string,
    reverseRegistrarAddress: string,
    erc721DatastoreAddress: string,
  ) {
    this.provider = provider
    this.registry = getRegistryContract(registryAddress, provider)
    this.defaultResolver = getPublicResolverContract(resolverAddress, provider)
    this.namedRegistrar = getNamedRegistrarContract(namedRegistrarAddress, provider)
    this.dcRegistrarController = getDcRegistrarControllerContract(dcRegistrarControllerAddress, provider)
    this.reverseRegistrar = getReverseRegistrarContract(reverseRegistrarAddress, provider)
    this.erc721Datastore = getERC721DatastoreContract(erc721DatastoreAddress, provider)
  }

  async getResolver(node: string): Promise<PublicResolver> {
    const resolverAddr = await this.registry.resolver(node)
    return getPublicResolverContract(resolverAddr, this.provider)
  }

  async getAddress(name: string) {
    const node = namehash(name)
    const resolver = await this.getResolver(node)
    return resolver.addr(node)
  }

  async getName(addr: string) {
    const node = await this.reverseRegistrar.node(addr)
    const resolver = await this.getResolver(node)
    return resolver.name(node)
  }

  async getERC721Datastore(addr: string, tokenId: BigNumber) {
    const name = await this.erc721Datastore.name(addr, tokenId)
    const labelhash = await this.erc721Datastore.labelhash(addr, tokenId)
    const nodehash = await this.erc721Datastore.nodehash(addr, tokenId)
    return { name, labelhash, nodehash }
  }

  async available(name: string) {
    return this.dcRegistrarController.available(name)
  }

  async rentPrice(name: string, duration: BigNumber) {
    return this.dcRegistrarController.rentPrice(name, duration)
  }

  async registerWithConfig(name: string, addr: string, duration: BigNumber) {
    const signer = await this.getSigner()
    const registrarControllerWithoutSigner = this.dcRegistrarController
    const registrarController = registrarControllerWithoutSigner.connect(signer)
    const resolverAddr = this.defaultResolver.address
    const value = await this.rentPrice(name, duration)

    const gasLimit = await registrarController.estimateGas.registerWithConfig(
      name,
      addr, 
      duration, 
      resolverAddr, 
      addr, 
      { value: value }
    )

    return this.dcRegistrarController.registerWithConfig(
      name, 
      addr, 
      duration,
      resolverAddr,
      addr, 
      { value: value, gasLimit })
  }

  async getSigner() {
    const signer = this.provider.getSigner()
    await signer.getAddress()
    return signer
  }
}

export async function setupRegistrar(network: NETWORK_NAME) {
  const provider = getProvider(network)
  let registryAddress: string
  let resolverAddress: string
  let namedRegistrarAddress: string
  let dcRegistrarControllerAddress: string
  let reverseRegistrarAddress: string
  let erc721DatastoreAddress: string

  switch (network) {
    case 'dogechain':
      registryAddress = ''
      resolverAddress = ''
      namedRegistrarAddress = ''
      dcRegistrarControllerAddress = ''
      reverseRegistrarAddress = ''
      erc721DatastoreAddress = ''
      break
    case 'dogechain-testnet':
      registryAddress = '0xD007B8EF92D6B17e8f7F6d0A4f774886670679C4'
      resolverAddress = '0x395a96b58574b4138f4F0B9d4A28935D1107732e'
      namedRegistrarAddress = '0xbEE8EfC14b2fe020c1Eb7F5EE810Dffa27d638eD'
      dcRegistrarControllerAddress = '0x9060b465DfEf00d42F2e946dD817126A95256Ac2'
      reverseRegistrarAddress = '0xef37430185AB743c769fa988Ba6b05dF9AfE4f47'
      erc721DatastoreAddress = '0x5272a9561234136Ea14FD5D7587D99c231dCd653'
      break
  }

  return new Registrar(
    provider,
    registryAddress,
    resolverAddress,
    namedRegistrarAddress,
    dcRegistrarControllerAddress,
    reverseRegistrarAddress,
    erc721DatastoreAddress,
  )
}