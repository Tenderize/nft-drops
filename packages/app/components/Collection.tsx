import { FC, useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi'
import { Subgraph, Claim, Drop as DropType } from "utils/queries"
import Router from 'next/router'
import Nav from "components/nav"
import Drops from "components/drops"
import Claims from "@/components/Collection"
import Drop from "components/drop"
import { SimpleGrid } from '@chakra-ui/react'

const Collection: FC<{drops: Array<DropType>, claims: Array<Claim>}> = ({drops, claims}) => {

  let dropsParsed = drops.filter(drop => {
      for (let i=0; i < claims.length; i++) {
          if (claims[i].drop.id === drop.id) return true
      }
      return false
  })

  return (
    <>
    <h1 className='text-4xl font-bold mt-6'>Collection</h1>
    <SimpleGrid columns={4} spacing={10}>
        {
            dropsParsed
            .map(drop => {
                return (<Drop key={drop.id} drop={drop} isClaimed={true} />
                )
            })
        }
    </SimpleGrid>
    </>
  )
};

export default Collection