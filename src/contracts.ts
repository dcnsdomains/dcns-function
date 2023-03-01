import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { Contract } from 'ethers'

import * as DcNSRegistryContract from './abis/DcNSRegistry.json'
import * as PublicResolverContract from './abis/PublicResolver.json'
import * as NamedRegistrarContract from './abis/NamedRegistrar.json'
import * as DcRegistrarControllerContract from './abis/DcRegistrarController.json'
import * as ReverseRegistrarContract from './abis/ReverseRegistrar.json'
import * as ERC721DatastoreContract from './abis/ERC721Datastore.json'

import { DcNSRegistry, PublicResolver, NamedRegistrar, DcRegistrarController, ReverseRegistrar, ERC721Datastore } from './abis/types'

export function getRegistryContract(address: string, provider: StaticJsonRpcProvider): DcNSRegistry {
  return new Contract(address, DcNSRegistryContract.abi, provider) as DcNSRegistry
}

export function getPublicResolverContract(address: string, provider: StaticJsonRpcProvider): PublicResolver {
  return new Contract(address, PublicResolverContract.abi, provider) as PublicResolver
}

export function getNamedRegistrarContract(address: string, provider: StaticJsonRpcProvider): NamedRegistrar {
  return new Contract(address, NamedRegistrarContract.abi, provider) as NamedRegistrar
}

export function getDcRegistrarControllerContract(address: string, provider: StaticJsonRpcProvider): DcRegistrarController {
  return new Contract(address, DcRegistrarControllerContract.abi, provider) as DcRegistrarController
}

export function getReverseRegistrarContract(address: string, provider: StaticJsonRpcProvider): ReverseRegistrar {
  return new Contract(address, ReverseRegistrarContract.abi, provider) as ReverseRegistrar
}

export function getERC721DatastoreContract(address: string, provider: StaticJsonRpcProvider): ERC721Datastore {
  return new Contract(address, ERC721DatastoreContract.abi, provider) as ERC721Datastore
}