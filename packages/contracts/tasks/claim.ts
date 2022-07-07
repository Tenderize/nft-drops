import { task, types } from 'hardhat/config'
import {Minter } from '../typechain-types'
import {AccountTree, processAddressFile} from '../utils/tree'

task('claim', 'claim a drop')
  .addParam('minter', 'Minter address', '', types.string)
  .addParam('id', 'drop id to claim', '', types.int)
  .addParam('for', 'address to send the drop to, defaults to caller if not specified', '', types.string, true)
  .addParam('addresses', 'input file to addresses', '', types.inputFile)
  .setAction(async (args, hre) => {
    const { ethers } = hre

    const claimants = await processAddressFile(args.addresses)

    const tree = new AccountTree(claimants)

    const signer = (await ethers.getSigners())[0]

    const proof = tree.getProofForAddress(signer.address)

    const Minter: Minter= await ethers.getContractAt('Minter', args.minter)

    const receiver = args.for ? args.for : signer.address

    const tx = await (await Minter.claimFor(args.id, proof, receiver)).wait()
    
    console.log(`Drop claimed id=${args.id} receiver=${receiver}`)
  })
