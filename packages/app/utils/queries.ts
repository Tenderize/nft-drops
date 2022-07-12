import { createClient, Client} from "urql"

const URL = "https://api.thegraph.com/subgraphs/name/tenderize/nft-drops-mumbai"

const GetData = `
    query getUser($id: Bytes!) {
        users {
            id
            claims {
                id
                drop {
                    id
                    uri
                }
            }
        }
        drops {
            id
            uri
            claims {
                id
            }
        }
    }
`

const GetDrops = `
{
    drops {
        id
        uri
        claims {
            id
        }
    }
}
`

const GetClaims = `
query getClaims($user: Bytes!) {
    claims(where: {user: $user}) {
        id
        drop {
            id
        }
    }
}
`

export type Drop = {
    id: number,
    uri: string
    claims: Array<Claim>
    metadata?: Metadata
}

export type Claim = {
    id: string;
    drop: Drop;
}

type User = {
    address: string;
    claims: Array<Claim>
}

type Data = {
    user: User,
    drops: Array<Drop>
}

export type Metadata = {
    name: string,
    description: string | undefined,
    image: string,
    animation_url: string
}

export class Subgraph {
    client: Client
    constructor() {
        this.client = createClient({
            url: URL
        })
    }

    async GetDrops():Promise<Array<Drop>> {
        let drops:Array<Drop> = []

        try {
            const res = await this.client.query(GetDrops).toPromise()
            drops = res?.data?.drops
        } catch (err) {
            console.log(err)
        }

        console.log(drops)
        return drops
    }

    async GetClaims(address: string):Promise<Array<Claim>> {
        let claims: Array<Claim> = []
        try {
            const res = await this.client.query(GetClaims, {user: address.toLowerCase()}).toPromise()
            claims = res?.data?.claims
        } catch (err) {
            console.log(err)
        }
        return claims
    }

    async getData(address: string): Promise<Data> {
        const data: Data = {} as Data

        try {
            const res = await this.client.query(GetData, {id: address.toLowerCase()}).toPromise()
            data.user = res?.data?.users[0]
            data.drops = res?.data?.drops
        } catch (err) {
            console.log(err)
        }

        return data
    }
  }