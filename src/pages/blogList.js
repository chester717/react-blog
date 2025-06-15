import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import db from "../firebase";
import {
  Divider,
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  IconButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import BlogForm from "../components/blogForm";

const cld = new Cloudinary({
  cloud: {
    cloudName: "dki3jsvdj",
  },
});

const BlogImage = ({ public_id }) => {
  if (!public_id) return null;

  const img = cld
    .image(public_id)
    .format("auto")
    .quality("auto")
    .resize(auto().gravity(autoGravity()).width(500).height(300));

    return (
      <Box mb={4} borderRadius="md" overflow="hidden" maxH="300px">
        <AdvancedImage cldImg={img} />
      </Box>
    )
};

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const blogCollection = collection(db, "blogs");

  const fetchBlogs = async () => {
    const snapshot = await getDocs(blogCollection);
    const blogData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBlogs(
      blogData.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds)
    );
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line 
  }, []);

  const addBlog = async (newBlog) => {
    await addDoc(blogCollection, {
      ...newBlog,
      timestamp: serverTimestamp(),
    });
    fetchBlogs();
  };

  const deleteBlog = async (id) => {
    try {
      const blog = doc(db, "blogs", id);
      await deleteDoc(blog);
      fetchBlogs();
    } catch (error) {
      alert("Error deleting blog:", error);
    }
  };

  return (
    <Box maxW="6xl" mx="auto" p="6">
      <Accordion allowToggle>
        <AccordionItem
          borderRadius="md"
          border="1px"
          borderColor="gray.200"
          overflow="hidden"
        >
          <h2>
            <AccordionButton
              px={4}
              py={3}
              _expanded={{ bg: "blue.500", color: "white" }}
            >
              <Box flex="1" textAlign="left" fontWeight="bold">
                Create New Blog
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} px={4}>
            <BlogForm addBlog={addBlog} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Divider my={8} />
      {blogs.length === 0 ? (
        <Text>No blogs found.</Text>
      ) : (
        <SimpleGrid columns={3} spacing={6}>
          {blogs.map((blog) => (
            <Box
              key={blog.id}
              p={6}
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              pos="relative"
              _hover={{
                boxShadow: "lg",
                transform: "translateY(-4px)",
                transition: "0.2s",
              }}
              role="group"
            >
              <IconButton
                icon={<CloseIcon />}
                size="sm"
                colorScheme="red"
                variant="ghost"
                pos="absolute"
                top="2"
                right="2"
                onClick={() => deleteBlog(blog.id)}
                opacity="0"
                _groupHover={{ opacity: 1 }}
                transition="opacity 0.2s"
              />
              <Stack spacing={3}>

                <BlogImage public_id={blog.imageUrl} />
                <Heading size={"md"} color="gray.800">
                  {blog.title}
                </Heading>
                <Text fontSize={"sm"} color={"gray.500"}>
                  {blog.date}
                </Text>
                <Text mt={2} noOfLines={3}>
                  {blog.content}
                </Text>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default BlogList;
