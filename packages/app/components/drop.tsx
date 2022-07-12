import { FC, useState } from "react";
import {
  Badge,
  Flex,
    Box,
    Button,
    Center,
    useColorModeValue,
    Heading,
    Text,
    Stack,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input
  } from '@chakra-ui/react';
import type { Drop as DropType } from "utils/queries";
import {useClaim} from "utils/useClaim"
import {useAccount} from "wagmi"
import { ethers } from "ethers";
  
const Drop: FC<{drop: DropType, isClaimed: boolean}> = ({drop, isClaimed}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {address} = useAccount()
    return (
      <>
      <Center py={12}>
        <Box
          onClick={onOpen}
          role={'group'}
          p={6}
          maxW={'300px'}
          w={'full'}
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow={'2xl'}
          rounded={'lg'}
          pos={'relative'}
          zIndex={1}>
            <Stack align={'center'}>
            <Image
              align='center'
              height={160}
              width={160}
              objectFit={'fill'}
              src={drop?.metadata?.image}
            />
            </Stack>
          <Stack pt={10} align={'center'}>
            <Heading fontSize={'xl'} fontFamily={'body'} fontWeight={300}>
              {drop?.metadata?.name}
            </Heading>
            <Stack px={5} direction="row">
            <Button
              fontSize={'sm'}
              rounded={'lg'}
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
              _focus={{
                bg: 'blue.500',
              }}
              onClick={onOpen}
              >
              Details
          </Button>
          </Stack>
          </Stack>
        </Box>
      </Center>
      <DropModal drop={drop} isClaimed={isClaimed} claimer={address || ethers.constants.AddressZero} isOpen={isOpen} onClose={onClose} />
      </>
    );
  }

  export default Drop

  const DropModal: FC<{drop: DropType, isClaimed: boolean, claimer: string, isOpen: boolean, onClose: any}> = ({drop, isClaimed,claimer, isOpen, onClose}) => {
    const [receiver, setReceiver] = useState('')
    const handleReceiverInput = (event:any) => setReceiver(event.target.value)
    const {data, isError, isLoading, claim} = useClaim(drop.id.toString(), claimer, receiver || claimer)

    return (
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size='2xl'>
      <ModalOverlay />
      <ModalContent>
      <Center py={6}>
      <Stack
        // w={{ sm: '100%', md: '540px' }}
        // height={{ sm: '476px', md: '20rem' }}
        direction={{ base: 'column', md: 'row' }}
        bg={useColorModeValue('white', 'gray.900')}
        padding={4}>
        <Flex>
        <Image
              rounded={'lg'}
              height={230}
              width={230}
              objectFit={'fill'}
              src={drop?.metadata?.image}
            />
        </Flex>
        <Stack
          flex={1}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p={1}
          pt={2}>
          <Heading fontSize={'xl'} fontFamily={'body'}>
            {drop?.metadata?.name}
          </Heading>
          <Text
            textAlign={'center'}
            color={useColorModeValue('gray.700', 'gray.400')}
            px={3}>
            {drop?.metadata?.description}
          </Text>
          <Stack
            hidden={isClaimed}
          >
          <Text>
            Receiver Address (optional):
          </Text>
          <Input 
            placeholder="0x1234... (optional)"
            onChange={handleReceiverInput}
          />
          </Stack>
          <Stack
            hidden={isClaimed}
            width={'50%'}
            mt={'2rem'}
            direction={'row'}
            padding={2}
            justifyContent={'space-between'}
            alignItems={'center'}>
            <Button
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              bg={'blue.400'}
              color={'white'}
              boxShadow={
                '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
              }
              _hover={{
                bg: 'blue.500',
              }}
              _focus={{
                bg: 'blue.500',
              }}
              onClick={() => claim()}
              >
              Claim
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Center>
      </ModalContent>
    </Modal>
    )
  }
