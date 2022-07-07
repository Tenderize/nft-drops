import hre, { ethers } from 'hardhat'

import { Minter, ERC1155Mintable } from '../typechain-types'

import { AccountTree } from '../utils/tree'
const { expect } = require('chai')

describe('Minter', function () {
  it('Creates new campaign', async () => {
    const account0 = await (await hre.ethers.getSigners())[0].getAddress()
    const account1 = await (await hre.ethers.getSigners())[1].getAddress()

    const Minter = await (await hre.ethers.getContractFactory('Minter')).deploy()
    const Token = await hre.ethers.getContractAt('ERC1155Mintable', await Minter.token())

    const initialSupply = 1
    const uri = 'https://1337.lol'
    const claimants = [account0.toLowerCase(), account1.toLowerCase()]
    const tree = new AccountTree(claimants)
    const root = tree.getHexRoot()
    const id = 1

    await Minter.create(initialSupply, uri, root)

    expect(await Minter.snapshots(id)).to.eq(root)
    expect(await Token.uris(id)).to.eq(uri)

    console.log(account0.toLowerCase())
    console.log(AccountTree.getLeafFromAddress(account0.toLowerCase()))

    await Minter.claim(id, tree.getProofForAddress(account0.toLowerCase()))
    expect((await Token.balanceOf(account0, id)).toString()).to.eq('1')
  })
})
