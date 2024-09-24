import {
  Avatar,
  Box,
  Flex,
  Spacer,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Img,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AddIcon, BellIcon, SearchIcon } from "@chakra-ui/icons";
import { Button } from "react-bootstrap";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./Modal/ProfileModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ChatLoading from "./ChatLoading";
import axios from "axios";
import UserListItem from "./UserListItem";
import GroupChatModal from "./Modal/GroupChatModal";
import { getSender } from "../utils/ChatLogic";
import groupAdd from "../assets/gropadd.png"
import chatLogo from "../assets/Chat-logo.jpg"

const Sidebar = () => {
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please enter a search term", { position: "top-left" });
    }
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to load search results", { position: "top-left" });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast.error("Failed to fetch the user", { position: "top-left" });
    }
  };
  return (
    <Box
      display={"flex"}
      flexDirection="column"
      justifyContent="space-between"
      height="98%"
      bg={"#edf6f9"}
      borderRadius={"8px 0px 0px 8px"}
      margin={1}
    >
      <Box
        mt={"20px"}
        display="flex"
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={8}
      >
        <img src={chatLogo} width={"50px"} alt="" />
        <Tooltip label="Search user">
          <Box onClick={onOpen}>
            <SearchIcon fontSize={"xl"} />
          </Box>
        </Tooltip>
        <Menu>
          <MenuButton>  
            <BellIcon fontSize={"xl"}/>
            {notification.length ===0? "":
          <Badge rounded={"lg"} mb='5' ml="-1" colorScheme='green'>{notification.length}
         </Badge>        }
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length && "No New Messages"}
            {notification.map((notif) => (
              <MenuItem key={notif._id} onClick={()=>{
                setSelectedChat(notif.chat)
                setNotification(notification.filter((n)=>n!==notif))
              }}>
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Messagefrom ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <div>
          <Tooltip label="Add group">
            <GroupChatModal>
              <Box>
                <img src={groupAdd} width={"50px"}  alt="" />
              </Box>
            </GroupChatModal>
          </Tooltip>
        </div>
      </Box>

      <Box
        mb={"35px"}
        display="flex"
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={5}
      >
        <ProfileModal user={user}>
          <div>
            <Avatar
              size={"sm"}
              cursor={"pointer"}
              name={user.name}
              src={user.profilePic}
            />
          </div>
        </ProfileModal>
        <Tooltip label="Logout">
          <Box onClick={logoutHandler}>
            <i class="fa-solid fa-arrow-right-from-bracket fa-xl"></i>
          </Box>
        </Tooltip>
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
            <DrawerBody>
              <Box display="flex" pb={2}>
                <Input
                  placeholder="Search by name"
                  mr={2}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>
                  <SearchIcon />
                </Button>
              </Box>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
              {loadingChat && <Spinner ml="auto" display="flex" />}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </Box>
  );
};

export default Sidebar;
