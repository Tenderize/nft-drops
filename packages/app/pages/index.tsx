import type { NextPage } from 'next';
import { FC, useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi'
import { Subgraph, Claim, Drop } from "utils/queries"
import { Drops } from "components/drops"
import { Claims } from "components/claims"

const Home: NextPage = () => {
  const {data: account} = useAccount()

  const [drops, setDrops] = useState(Array<Drop>)
  const [claims, setClaims] = useState(Array<Claim>)

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const data = await (new Subgraph()).getData(account?.address ??  '')
    if (data?.drops) setDrops(data.drops);
    if (data?.user) setClaims(data.user.claims)
  }

  console.log(claims)

  return (
    <div className='py-6 justify-center text-center'>
      <div className='flex justify-center'>
        <ConnectButton showBalance={true} label="Connect Wallet" accountStatus={"address"} />
      </div>

      <h1 className='text-4xl font-bold mt-6'>Tenderize Achievements</h1>
      <Drops drops={drops} />
      <Claims claims={claims} />
    </div>    
  );
};

export default Home;
