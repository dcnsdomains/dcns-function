export * from './contracts'
export * from './provider'
export * from './registrar'

import * as DcNSRegistryContract from './abis/DcNSRegistry.json'
import * as PublicResolverContract from './abis/PublicResolver.json'
import * as NamedRegistrarContract from './abis/NamedRegistrar.json'
import * as DcRegistrarControllerContract from './abis/DcRegistrarController.json'
import * as ReverseRegistrarContract from './abis/ReverseRegistrar.json'
import * as ERC721DatastoreContract from './abis/ERC721Datastore.json'

export {
  DcNSRegistryContract,
  PublicResolverContract,
  NamedRegistrarContract,
  DcRegistrarControllerContract,
  ReverseRegistrarContract,
  ERC721DatastoreContract,
}
