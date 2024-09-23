import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Avatar, Box,Stack,Text } from '@chakra-ui/react'
import ChatLoading from "./ChatLoading";
import {getSender, getSenderFull} from '../utils/ChatLogic'

const Chat = ({fetchAgain}) => {

  const {selectedChat, setSelectedChat, user, chats,setChats }=ChatState()
  const [loggedUser,setLoggedUser]=useState()

  const fetchChats = async() =>{
    try {
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data}=await axios.get("/api/chat",config)
      setChats(data)
      console.log(data)
    } catch (error) {
      toast.error("Failed to load the chat")
    }
  }

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats()
  },[fetchAgain])
  return (
    <Box
    display={{base:selectedChat? "none": "flex", md:"flex"}}
    flexDirection="column"
    p={3}
    w={{base:"100%",md:"40%"}}
    // height={"100%"}
    bg="white"
    
    >
      <Box
      p={2}
      px={3}
      mb={2}
      fontSize="30px"
      fontFamily="Work sans"
      bg="#caf0f8"
      borderRadius="12px"
      >
       ChatterBox 
      </Box>

      <Box
      d="flex"
      p={3}
      flexDirection="column"
      bg="#f8f8f8"
      w="100%"
      h="100%"
      borderRadius="lg"
      overflowY="hidden"
      >
        {chats?(
          <Stack overflowY="scroll">
            { chats.map((chat)=>(
              <Box
              onClick={()=>setSelectedChat(chat)}
              cursor="pointer"
              bg={selectedChat === chat ? "#bde0fe" : "#e8e8e8"}
              color={selectedChat===chat?"black": "black"}
              px={3}
              py={4}
              _hover={"#a2d2ff"}
              borderRadius="lg"
              key={chat._id}
              >
                <Text display={"flex"} alignItems={"center"}>
                <Avatar
                      mr={2}
                      size="md"
                      cursor="pointer"
                      name={getSender(user, chat.users)}
                      src={getSenderFull(user, chat.users).profilePic}
                    />
               
                  {!chat.isGroupChat? getSender(loggedUser,chat.users):chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ):(
          <ChatLoading/>
        )}
      </Box>
    </Box>
  )
}

export default Chat