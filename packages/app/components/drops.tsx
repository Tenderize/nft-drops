import { FC, useState } from "react";
import { Drop as DropType } from "@/utils/queries";
import { useAccount } from 'wagmi'
import Drop from 'components/drop'
import { SimpleGrid, Switch, FormLabel, Stack, Text } from '@chakra-ui/react'

const Drops: FC<{drops: Array<DropType>}> = ({drops}) => {
    const {address} = useAccount()
    
    const [showClaimed, setShowClaimed] = useState(false)

    let dropsParsed = showClaimed ? drops : drops.filter(drop => {
        for (let i=0; i < drop.claims.length; i++) {
            console.log(drop.claims[i].id.includes(address?.toLowerCase() || ""))
            if (drop.claims[i].id.includes(address?.toLowerCase() || "")) return false;
        }
        return true
    })

    const isClaimed = (drop: DropType):boolean => {
        for (let i=0; i < drop.claims.length; i++) {

            if (drop.claims[i].id.includes(address?.toLowerCase() || "")) return true;
        }
        return false
    } 

    return (
        <>
        <h1 className='text-4xl font-bold mt-6'>Drops</h1>
        <Stack pl={5} direction="row">
        <Switch isChecked={showClaimed} id='showClaimed' size='lg' onChange={() => setShowClaimed(!showClaimed)} />
        <Text> Show Claimed</Text>
        </Stack>
        <SimpleGrid columns={4} spacing={10}>
            {   
            dropsParsed.length == 0 ? (<Text py={10} justifyContent={'center'}>No New Drops...</Text>) :
                dropsParsed
                .map(drop => {
                    return (<Drop key={drop.id} drop={drop} isClaimed={isClaimed(drop)} />
                    )
                })
            }
        </SimpleGrid>
        </>
    )
}

export default Drops