import { Created, Claimed } from '../generated/Minter/Minter'
import { Claim, Drop, Minter, User } from '../generated/schema'
import { ByteArray } from '@graphprotocol/graph-ts'

export function newDrop(event: Created): void {
  let drop = new Drop(event.params.id.toString())
  drop.uri = event.params.uri
  drop.save()
}

export function newClaim(event: Claimed): void {
  let id = event.params.id.toString()
  let claim = new Claim(
    ByteArray.fromHexString(
      event.params.id.toString()
        .concat('_', event.params.claimer.toHex())
    )
  )
 
  // create user if it doesn't exist
  if (User.load(event.params.claimer) == null) {
    (new User(event.params.claimer)).save()
  }

  claim.user = event.params.claimer
  claim.drop = id
  claim.save()
}