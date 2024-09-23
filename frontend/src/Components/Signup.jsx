import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
} from "@chakra-ui/react";
import {  toast } from 'react-toastify';
import React, { useState } from "react";
import signupImg from "../assets/signupImg.png";
import axios from "axios"
import {useNavigate} from "react-router-dom"

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [profilePic, setProfilePic] = useState();
  const [loading,setLoading]=useState(false);

  const navigate=useNavigate()

  const postDetails =(pic)=>{
    setLoading(true);
    if(pic===undefined){
      toast.warning("Please select a photo")
      return
    }
    if(pic.type=== "image/jpeg" || pic.type==="image/png" || pic.type==="image/jpg"){
      const data = new FormData()
      data.append("file",pic)
      data.append("upload_preset","chatter-box")
      data.append("cloud_name","dtlcf2qi8")
      fetch("http://api.cloudinary.com/v1_1/dtlcf2qi8/image/upload",{
        method: "POST",
        body: data
      })
      .then((res)=>res.json())
      .then((data)=>{
        setProfilePic(data.url.toString())
        setLoading(false)
        console.log(data)
      })
      .catch((err)=>{
        console.log(err)
        setLoading(false)
      })
    }
  }

  const handleSubmit=async()=>{
    setLoading(true)
    if(!name || !email || !password || !confirmPassword){
      toast.warning("Please fill all fields")
      setLoading(false)
      return
    }
    if(password !== confirmPassword){
      toast.warning("Passwords do not match")
      return
    }

    try {
      const config={
        headers:{
          "Content-type": "application/json"
        }
      }
      const {data}=await axios.post("/api/user",{name,email,password,profilePic},config)
      localStorage.setItem("userInfo",JSON.stringify(data))
      navigate("/chats")
      toast.success("User is successfully registered")
    } catch (error) {
      toast.error("An error occurred")
      setLoading(false)
    }
  }

  return (
    <Box p={2} display={{ md: "flex" }}>
      <Box flexShrink={0} display={{ base: "none", md: "block" }}>
        <img  style={{borderRadius:"16px"}} src={signupImg} alt="" width={"280px"} />
      </Box>
      <Box mt={{ base: 2, md: 0 }} ml={{ md: 9 }} width={"100%"}>
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your paasword"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <FormControl id="confirm-password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormControl>

        <FormControl id="profile-pic" isRequired>
          <FormLabel>Profile Picture</FormLabel>
          <Input
            type="file"
            p={1.5} accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </FormControl>
        <Text fontSize={15} mt={2}>Already have an account?  Click Login</Text>

        
        <Button colorScheme="blue" width={"100%"} color={"white"}  isLoading={loading} onClick={handleSubmit}>SignUp</Button>
      </Box>
    </Box>
  );
};

export default Signup;
