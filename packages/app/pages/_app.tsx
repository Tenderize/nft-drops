import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react'
import { Subgraph, Claim, Drop} from "utils/queries"

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [
    jsonRpcProvider({ rpc: () => ({ http: 'https://rpc.ankr.com/polygon_mumbai' }) }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Tenderize Achievements',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;