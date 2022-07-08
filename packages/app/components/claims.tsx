import { FC } from "react";
import { Claim } from "@/utils/queries";

export const Claims: FC<{claims: Array<Claim>}> = ({claims}) => {

    return (
        <>
            {
                claims.map(claim => {
                    return (<div key={claim.id}>
                        {claim?.drop.id} {claim?.drop.uri}
                    </div>
                    )
                })
            }
        </>
    )
}