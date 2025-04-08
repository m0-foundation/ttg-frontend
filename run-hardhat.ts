import setup from './hardhat/setup'
import deployTtg from './hardhat/deploy-ttg'

async function run() {
  const env = await setup()
  await deployTtg(env)
}

run()
