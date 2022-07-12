const abi = require("@nft-drops/subgraph/abis/Minter.json")
// import { AccountTree } from "@nft-drops/contracts/utils/tree"
import path from "path"

import { useContractWrite, chain } from 'wagmi'

const minterAddress = "0x7deBE83158Ad0B5319CC409d3d36106B26D5E00F"

export const useClaim = (id: string, claimer: string, receiver: string) => {
    claimer = claimer || ethers.constants.AddressZero
    const pathname = path.resolve(__dirname, id)
    const claimants = require(`../snapshots/${id}.json`)

    const tree = new AccountTree(claimants)
    const proof = tree.getProofForAddress(claimer)

    const { data, isError, isLoading, write: claim } = useContractWrite({
        addressOrName: minterAddress,
        contractInterface: abi,
        functionName: 'claimFor',
        chainId: chain.polygonMumbai.id,
        args: [id, proof, receiver]
    })

    return {data, isError, isLoading, claim}
}


const {  bufferToHex } = require('ethereumjs-util')
import { ethers, utils } from 'ethers'

export interface MerkleTree {
  elements: Array<string[66]>
  layers: Array<Layer>
}

type Layer = Array<string[66]>

export class MerkleTree {
  constructor(elements) {
    // Filter empty strings and hash elements
    this.elements = elements.filter((el) => el).map((el) => utils.keccak256(el))

    // Deduplicate elements
    this.elements = [...new Set(this.elements)]
    // Sort elements
    this.elements.sort()

    // Create layers
    this.layers = this.getLayers(this.elements)
  }

  getLayers(elements) {
    if (elements.length === 0) {
      return [['']]
    }

    const layers: Array<Layer> = []
    layers.push(elements)

    // Get next layer until we reach the root
    while (layers[layers.length - 1].length > 1) {
      layers.push(this.getNextLayer(layers[layers.length - 1]))
    }

    return layers
  }

  getNextLayer(elements) {
    return elements.reduce((layer, el, idx, arr) => {
      if (idx % 2 === 0) {
        // Hash the current element with its pair element
        layer.push(this.combinedHash(el, arr[idx + 1]))
      }

      return layer
    }, [])
  }

  combinedHash(first, second) {
    if (!first) {
      return second
    }
    if (!second) {
      return first
    }

    return utils.keccak256(this.sortAndConcat(first, second))
  }

  getRoot() {
    return this.layers[this.layers.length - 1][0]
  }

  getHexRoot() {
    return bufferToHex(this.getRoot())
  }

  getProof(el) {
    let idx = this.indexOf(el, this.elements)

    if (idx === -1) {
      console.log(new Error('Element does not exist in Merkle tree'))
    }

    return this.layers.reduce((proof, layer) => {
      const pairElement = this.getPairElement(idx, layer)

      if (pairElement) {
        proof.push(pairElement)
      }

      idx = Math.floor(idx / 2)

      return proof
    }, [])
  }

  // getHexProof (el) {
  //   const proof = this.getProof(el);

  //   return this.bufArrToHexArr(proof);
  // }

  getPairElement(idx, layer) {
    const pairIdx = idx % 2 === 0 ? idx + 1 : idx - 1

    if (pairIdx < layer.length) {
      return layer[pairIdx]
    } else {
      return null
    }
  }

  indexOf(el, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (el === arr[i]) {
        return i
      }
    }

    return -1
  }

  sortAndConcat(...args) {
    args = [...args].sort()
    return utils.solidityPack(['bytes32', 'bytes32'], args)
  }
}

export interface AccountTree extends MerkleTree {
  leaves: Array<string>
}

export class AccountTree extends MerkleTree {
  constructor(addresses) {
    super(addresses)
  }

  static fromJSON(json: string) {
    let leaves = JSON.parse(json)
    let thisClass = Object.create(this.prototype)
    // Filter empty strings and hash elements
    let elements = leaves.filter((el) => el).map((el) => utils.keccak256(el))

    // Deduplicate elements
    elements = [...new Set(elements)]
    // Sort elements
    elements.sort()

    // Create layers
    thisClass.layers = thisClass.getLayers(elements)

    return thisClass
  }

  static getLeafFromAddress(address: string) {
    return utils.keccak256(address)
  }

  getProofForAddress(address: string) {
    return super.getProof(utils.keccak256(address))
  }

  toJSON() {
    return JSON.stringify(this.elements, null, 4)
  }
}
