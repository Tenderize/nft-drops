import {FC} from "react"

import Nav from  "./nav"

const Layout: FC<{children: React.ReactNode}> = ({children}) => {
    return (
        <>
          <Nav />
          <main>{children}</main>
        </>
      )
}

export default Layout