import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import Comment from "../Comment/Comment";
import { formatDistanceToNowStrict } from "date-fns";
import userAtom from "../../atoms/userAtom";
import { useRecoilValue } from "recoil";

const FeedPost = ({ post, postedBy }) => {
  const [user, setUser] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isComments, setIsComments] = useState(true);
  const currentuser = useRecoilValue(userAtom);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${postedBy}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.log(err);
        alert(err);
      }
    };

    getUser();
  }, []);

  return (
    <>
      <Box mb={12}>
        {user ? (
          <PostHeader
            username={user.username || ""}
            avatar={user.profilePic || ""}
            date={post.createdAt}
            link={user.username}
          />
        ) : null}

        <Box onClick={onOpen}>
          <Image
            my={2}
            mb={4}
            src={post.img}
            alt="post image"
            borderRadius={"sm"}
          />
        </Box>
        <PostFooter post={post} />
      </Box>

      <Modal
        isCentered={true}
        size={{ base: "3xl", md: "2xl", lg: "4xl" }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody bg={"black"} pb={5}>
            {/* MODAL BODY */}
            <Flex
              direction={"row"}
              gap={4}
              w={{ base: "90%", sm: "70%", md: "full" }}
              mx={"auto"}
            >
              {/* IMAGE */}
              <Box
                borderRadius={4}
                overflow={"hidden"}
                flex={1}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Image
                  src={post.img}
                  maxH={"85vh"}
                  w={"100%"}
                  objectFit={"cover"}
                  borderRadius={4}
                />
              </Box>

              {/* CONTENT */}
              <Flex
                flex={1}
                flexDir={"column"}
                pl={6}
                pr={10}
                display={{ base: "none", md: "flex" }}
                justifyContent={"space-between"}
                alignItems={"stretch"}
              >
                <Flex alignItems={"center"} justifyContent={"space-between"}>
                  {/* PROFILE */}
                  <Flex w={"fit-content"} alignItems={"center"} gap={4}>
                    <Avatar src={user ? user.profilePic : ""} />
                    <Text fontWeight={"bold"}>{user ? user.username : ""}</Text>
                  </Flex>

                  {/* DELETE ICON */}
                  {currentuser._id == postedBy && (
                    <Box
                      _hover={{ bg: "whiteAlpha.300" }}
                      padding={"0.5rem"}
                      borderRadius={"full"}
                    >
                      <MdDelete size={20} cursor={"pointer"} />
                    </Box>
                  )}
                </Flex>
                <Divider my={2} mb={0} bg={"gray.700"} />
                {/* Tabs */}
                <Flex alignItems={"center"} justifyContent={"center"}>
                  <Text
                    borderTop={isComments ? null : "1px solid white"}
                    flex={1}
                    fontSize={14}
                    textAlign={"center"}
                    w={"full"}
                    p={2}
                    onClick={() => setIsComments(false)}
                    cursor={"pointer"}
                  >
                    Post Info
                  </Text>
                  <Text
                    borderTop={isComments ? "1px solid white" : null}
                    flex={1}
                    fontSize={14}
                    textAlign={"center"}
                    w={"full"}
                    p={2}
                    onClick={() => setIsComments(true)}
                    cursor={"pointer"}
                  >
                    Comments
                  </Text>
                </Flex>
                <Divider my={2} bg={"gray.700"} />
                {/*  */}
                {isComments ? (
                  <>
                    {/* Comments */}
                    <VStack
                      w={"full"}
                      alignItems={"start"}
                      maxH={"30vh"}
                      overflowY={"auto"}
                    >
                      {post.replies.map((reply) => (
                        <Comment reply={reply} key={reply._id} />
                      ))}
                      {post.replies.length == 0 && (
                        <Text textAlign={"center"} width={"100%"}>
                          No comments
                        </Text>
                      )}
                    </VStack>
                  </>
                ) : (
                  <>
                    <Text
                      fontSize={16}
                      color={"whiteAlpha.900"}
                      maxH={"30vh"}
                      overflowY={"auto"}
                    >
                      {post.text}
                    </Text>
                    <Divider my={2} mt={4} bg={"gray.700"} />
                    <Flex
                      justifyContent={"space-between"}
                      w={"full"}
                      color={"whiteAlpha.700"}
                      fontSize={14}
                    >
                      <Text>Date posted:</Text>{" "}
                      <Text as={"span"} fontSize={14} color={"white"}>
                        {formatDistanceToNowStrict(new Date(post.createdAt))}{" "}
                        ago
                      </Text>
                    </Flex>
                  </>
                )}
                {/*  */}
                <Divider my={2} mb={4} bg={"gray.700"} />
                <Box mt={"auto"} mb={2}>
                  <PostFooter isProfilePage={true} post={post} />
                </Box>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FeedPost;
