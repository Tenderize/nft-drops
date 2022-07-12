import type { NextPage } from 'next';
import { FC, useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi'
import { Subgraph, Claim, Drop} from "utils/queries"
import Drops from "components/drops"
import Claims from "@/components/Collection"
import Router from 'next/router'
import Nav from "components/nav"
import Layout from "components/layout"
import Collection from 'components/Collection';

const Dashboard: NextPage = (props: any) => {
  const {address, isConnected} = useAccount()
  useEffect(() => {
    if (!isConnected) Router.push('/')
  })

  const [claims, setClaims] = useState(Array<Claim>)

  useEffect(() => {
    getClaims(address)
  }, [])

  const getClaims = async (address: string | undefined) => {
    const claims = await (new Subgraph()).GetClaims(address ?? '')
    if (claims?.length > 0) setClaims(claims)
  }
  

  return (
    <Layout>
    <div className='py-6 justify-center text-center'>
      <Drops drops={props?.drops}/>
      <Collection drops={props?.drops} claims={claims} />
    </div> 
    </Layout>   
  );
};

export default Dashboard

export async function getServerSideProps() {
  const drops = await (new Subgraph()).GetDrops()
  const baseUri =" https://gateway.pinata.cloud/ipfs/"
  let metadatas = await Promise.all(drops.map(drop => fetch(baseUri.concat(drop.uri.substring(7)))))
  metadatas = await Promise.all(metadatas.map(d => d.json()))
  console.log(metadatas[0])
  const dropsFull= drops.map((drop, i) => {
    const data: any = metadatas[i]
    return {
      ...drop,
      metadata: {
        image: baseUri.concat(data?.image.substring(7)),
        name: data?.name,
        description: data?.description,
        animation_url: baseUri.concat(data?.animation_url.substring(7))
      }
    }
  })

  return {props: {
    drops: dropsFull,
  }}
}