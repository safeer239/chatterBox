import {
  Container,
  Text,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "../Components/Login";
import Signup from "../Components/Signup";
import { useNavigate } from "react-router-dom";
import chatLogo from "../assets/Chat-logo.jpg"


const Home = () => {

  const navigate=useNavigate()

  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem('userInfo'));

    if(user) navigate("/chats")
  },[navigate])
  
  return (
    <Container maxW="750px" >
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        m="10px 0 10px 0"
        borderRadius="lg"
        gap={3}
        borderWidth="1px"
      >
        <img  src={chatLogo} width={"50px"} alt="" />
        <Text  fontFamily="work sans" fontSize="4xl" textAlign="center">
          ChatterBox
        </Text>
      </Box>
      <Box bg={"white"} borderRadius={"lg"} p={3}>
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>SignUp</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
