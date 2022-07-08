import { FC, useEffect, useState} from "react";
import { Subgraph, Drop } from "@/utils/queries";
import { useAccount } from 'wagmi'

export const Drops: FC<{drops: Array<Drop>, showClaimed?: boolean}> = ({drops, showClaimed}) => {
    const {data: account} = useAccount()

    let dropsParsed = !showClaimed ? drops : drops.filter(drop => {
        for (let i=0; i < drop.claims.length; i++) {
            if (drop.claims[i].id.includes(account?.address || "")) return false;
        }
        return true
    })

    return (
        <>
            {
                dropsParsed
                .map(drop => {
                    console.log()
                    console.log(drop.claims[0].id)
                    return (<div key={drop.id}>
                        {drop.id} {drop.uri}
                    </div>
                    )
                })
            }
        </>
    )
}