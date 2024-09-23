import { Container,Text,Box,VStack, Flex} from '@chakra-ui/react'
import Sidebar from '../Components/Sidebar'
import Chat from '../Components/Chat'
import ChatArea from '../Components/ChatArea'
import { ChatState } from '../Context/ChatProvider'
import { useState } from 'react'

const Chats = () => {
   const {user,selectedChat}=ChatState()
   const [fetchAgain,setFetchAgain]=useState(false)

  return (
    <Box width="100%" bg="#bde0fe" d="flex" alignItems="center" height="100vh" justifyContent="center">
    <Box
      m={{ base: 0, lg:5 }}  // Margin is 0 on mobile/tablet and 5 on larger screens
      borderRadius={"8px"}
      height={{ base: "100dvh", lg: "95dvh" }}  // Height is 100vh on mobile/tablet and 90vh on larger screens
      bg="#F2F2F2"
    
    >
      {/* {user &&<SideDrawer/>} */}
    <Flex height="100%">
  {/* <Box 
    display={{ base: "block", md: "block" }} 
    width={{ base: "10%", sm: "8%" , md: "8%", lg: "4%" }} 
    borderRadius="13px 0px 0px 13px"  
    height="100%" 
    bg="green" 
    d="flex" 
    justifyContent="center" 
    alignItems="center"
  > */}
    {user && <Sidebar/>}
  {/* </Box> */}
  {/* <Box 
    width={{ base: "90%", sm:"92%", md: "92%", lg: "32%" }} 
    display={{base:selectedChat? "none": "flex", lg:"flex"}}
    // borderRadius={{ md:"0px 15px 15px 0px"  }}
    height="100%" 
    bg="lightgreen" 
    d="flex" 
    justifyContent="center" 
    alignItems="center"
  > */}
    {user && <Chat fetchAgain={fetchAgain}  />}
  {/* </Box> */}
  {/* <Box  
    display={{base:selectedChat? "flex": "none", lg:"flex"}}
    width={{ base: "0%", md: "0%", lg: "69%" }}
    height="100%" 
    borderRadius="0px 15px 15px 0px"  
    bg="lightcoral" 
    d="flex" 
    justifyContent="center" 
    alignItems="center"
  > */}
    {user && <ChatArea fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
  {/* </Box> */}
</Flex>
    </Box>
  </Box>
  )
}

export default Chats