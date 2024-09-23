import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { toast } from "react-toastify";
import UserBadgeItem from "../UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameloading] = useState(false);

  const handleRename = async() => {
    if(!groupChatName) return;

    try {
      setRenameloading(true);
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data}= await axios.put("/api/chat/rename",{
        chatId:selectedChat._id,
        chatName:groupChatName
      }, config)
      setSelectedChat(data)
      setFetchAgain(fetchAgain)
      setRenameloading(false)
    } catch (error) {
      toast.error("Error required")
      setRenameloading(false)
    }
    setGroupChatName("")
  };

  const handleAddUser = async(user1) => {
    if(selectedChat.users.find((u)=>u._id === user1._id)){
      toast.warning("User already in the group")
      return
    }

    if(selectedChat.groupAdmin._id !== user._id){
      toast.warning("Only admin can add users")
      return
    }

    try {
      setLoading(true)
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data}= await axios.put("/api/chat/groupAdd",{
        chatId:selectedChat._id,
        userId:user1._id
      },config)
      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
    } catch (error) {
      toast.error("Error occured")
    }
  }

  const handleRemove = async(user1) => {
    if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
      toast.warning("Only admin can remove users")
      return
  };
  try {
    setLoading(true)
    const config={
      headers:{
        Authorization:`Bearer ${user.token}`,
      }
    }
    const {data}= await axios.put("/api/chat/groupRemove",{
      chatId:selectedChat._id,
      userId:user1._id
    },config)
    user1._id === user._id? setSelectedChat():setSelectedChat(data)
    setFetchAgain(!fetchAgain)
    fetchMessages()
    setLoading(false)
  } catch (error) {
    toast.error("Failed to remove user")
  }
}
  
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to load search results");
    }
  };  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input placeholder="chat Name" mb={3} value={groupChatName} onChange={(e)=>setGroupChatName(e.target.value)} />
              <Button variant={"solid"} colorScheme="teal" ml={1} isLoading={renameloading} onClick={handleRename} >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input placeholder="Add user to group" mb={1} onChange={(e)=>handleSearch(e.target.value)} />
            </FormControl>
            {loading ?(
              <Spinner size={"lg"}/>
            ):(
              searchResult?.map((user)=>(
                <UserListItem key={user._id} user={user} handleFunction={()=>handleAddUser(user)} />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={()=>handleRemove(user)}>
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
