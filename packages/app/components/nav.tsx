import { ReactNode, useState } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Image
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import { FC } from 'react'
import {ConnectButton} from '@rainbow-me/rainbowkit'
import NextLink from 'next/link'


const Links = [
    // {
    //     label: 'My Collection',
    //     path: 'dashboard/collection'
    // },
    // {
    //     label: 'Drops',
    //     path: '/dashboard'
    // }
];

type Link = {
    label: string,
    path: string
}

export const NavLink: FC<{link: Link}> = ({ link }) => (
  <Link
    as={NextLink}
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={link.path}
    >
    {link.label}
  </Link>
);

export const Nav: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [ showCollection , setShowCollection] = useState(false)

  return (
    <>
      <Box bg={useColorModeValue('gray.800', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <Image 
               width={150}
              src="tenderize.svg"></Image>
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {Links.map((link: any) => (
                <NavLink key={link.path} link={link}></NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <ConnectButton showBalance={true} label="Connect Wallet" accountStatus={"full"} />
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link: any) => (
                <NavLink key={link.path} link={link}></NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}

export default Nav