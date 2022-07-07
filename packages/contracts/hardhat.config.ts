import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

import { HardhatUserConfig } from 'hardhat/types'
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@primitivefi/hardhat-dodoc'
import 'hardhat-gas-reporter'

function loadTasks () {
  const tasksPath = path.join(__dirname, 'tasks')
  fs.readdirSync(tasksPath).forEach(task => {
    require(`${tasksPath}/${task}`)
  })
}

if (
  fs.existsSync(path.join(__dirname, 'artifacts')) &&
  fs.existsSync(path.join(__dirname, 'typechain-types'))
) {
  loadTasks()
}

dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY


const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.15',
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 15000,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      blockGasLimit: 30_000_000,
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : undefined
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  // Avoid foundry cache conflict.
  paths: { cache: 'hh-cache' },
}

export default config
