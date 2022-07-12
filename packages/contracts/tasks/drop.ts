import { task, types } from 'hardhat/config'
import {Minter } from '../typechain-types'
import {AccountTree, processAddressFile} from '../utils/tree'

const events = require('events');
const fs = require('fs');
const readline = require('readline');

task('drop', 'create a new drop')
  .addParam('minter', 'Minter address', '', types.string)
  .addParam('uri', 'token uri', '', types.string)
  .addParam('addresses', 'input file to addresses', '', types.inputFile)
  .setAction(async (args, hre) => {
    const { ethers } = hre

    const claimants = await processAddressFile(args.addresses)

    const tree = new AccountTree(claimants)

    const root = tree.getHexRoot()

    const Minter: Minter= await ethers.getContractAt('Minter', args.minter)

    const tx = await (await Minter.create(claimants.length, args.uri, root)).wait()
    
    const event = tx?.events?.filter(e => e.event === 'Created')[0]

    console.log(`New drop created id=${event?.args?.id} uri=${args.uri}  root=${root}`)
  })