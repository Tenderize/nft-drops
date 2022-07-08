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

export type Drop = {
    id: number,
    uri: string
    claims: Array<Claim>
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

export class Subgraph {
    client: Client
    constructor() {
        this.client = createClient({
            url: URL
        })
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