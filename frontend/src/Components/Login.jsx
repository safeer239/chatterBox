import {
  Container,
  Box,
  Button,
  FormControl,
  Flex,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Spacer,
  VStack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import loginImg from "../assets/loginImg.png";
import { useNavigate } from "react-router-dom";
import {  toast } from 'react-toastify';
import axios from "axios";



const Login = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState()

  const handleSubmit=async()=>{
    setLoading(true)
    if(!email || !password){
      toast.warning("Please fill all required fields")
      setLoading(false)
      return
    }

    try {
      const config={
        headers:{
          "Content-type": "application/json",
        }
      }
      const {data}=await axios.post("/api/user/login",{email,password},config)
      toast.success("Login successfull")
      localStorage.setItem("userInfo", JSON.stringify(data))
      setLoading(false)
      navigate("/chats")
    } catch (error) {
      toast.error("An error occured")
      setLoading(false)
    }
  }
  return (
    <Box p={2} display={{ md: "flex" }}>
      <Box  flexShrink={0} display={{ base: "none", md: "block" }}>
        <img src={loginImg} alt="" width={"280px"} />
      </Box>
      <Box mt={{ base: 4, md: 0 }} ml={{ md: 9 }} width={"100%"}>
        <FormControl id="email" isRequired mb={2}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl id="password" isRequired mb={2}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your paasword"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Text fontSize={15} mt={5}>Don't have an account?  Click Signup</Text>
        <Button colorScheme="blue" width={"100%"} color={"white"} mt={"25px"} isLoading={loading} onClick={handleSubmit}>Login</Button>
        {/* <Button colorScheme="red" width={"100%"} color={"white"} mt={"25px"} onClick={()=>{setEmail("guest@example.com"); setPassword("123456")}}>Get Guest User Credentials</Button> */}

      </Box>
    </Box>
  );
};

export default Login;
