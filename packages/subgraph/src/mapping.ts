import { Created, Claimed } from '../generated/Minter/Minter'
import { Claim, Drop, User } from '../generated/schema'
import { Bytes, BigInt } from '@graphprotocol/graph-ts'

Bytes.fromHexString

export function handleDrop(event: Created): void {
  let drop = new Drop(event.params.id.toString())
  drop.uri = event.params.uri
  drop.merkleroot = event.params.merkleRoot
  drop.timestamp = event.block.timestamp.toI32()
  drop.save()
}

export function handleClaim(event: Claimed): void {
  let id = event.params.id.toString()
  let claim = new Claim(
    event.params.claimer.concatI32(event.params.id.toI32())
  )
 
  // create user if it doesn't exist
  if (User.load(event.params.claimer) == null) {
    (new User(event.params.claimer)).save()
  }

  claim.user = event.params.claimer
  claim.drop = id
  claim.save()
}