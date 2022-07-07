import { task, types } from 'hardhat/config'
import {Minter } from '../typechain-types'

task('deploy', 'deploy a new Minter')
  .setAction(async (args, hre) => {
    const { ethers } = hre

    const Minter = await (await ethers.getContractFactory('Minter')).deploy()
    await Minter.deployed()

    console.log(Minter.address)
  })