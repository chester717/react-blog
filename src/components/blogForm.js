import React, { useState } from "react";
import {
  Box,
  Input,
  Textarea,
  Button,
  VStack,
  useToast,
  FormControl,
  FormLabel,
  Image,
  Stack,
} from "@chakra-ui/react";

// const CLD_CLOUD_NAME = "dki3jsvdj";
// const CLD_ApI_KEY = "114335982688731";
// const CLD_ApI_SECRET = "Qa2HLtkC6wgIPqXdiGPQ9-1AcCs";
// const CLD_ENV =
//   "CLOUDINARY_URL=cloudinary://114335982688731:Qa2HLtkC6wgIPqXdiGPQ9-1AcCs@dki3jsvdj";
const UpLOAD_pRESET = "free-upload";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dki3jsvdj/image/upload";

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", UpLOAD_pRESET);

    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      return data.public_id;
    } else {
      throw new Error(data.error.message || "image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!title || !content) {
      toast({
        title: "All fields are required",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = "";

      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const timestamp = Date.now();
      const newPost = {
        title,
        content,
        date: new Date(timestamp).toLocaleDateString(),
        imageUrl,
      };

      addBlog(newPost);

      // Reset form
      setTitle("");
      setContent("");
      setImageFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error(error);
      toast({
        title: "Image upload failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // create blog obj

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack>
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="enter blog title"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Content</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="enter blog content"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Cover Image</FormLabel>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </FormControl>

        {previewUrl && (
          <Image
            src={previewUrl}
            alt="preview-image"
            boxSize="200px"
            objectFit="cover"
          />
        )}
      </Stack>
      <VStack>
        <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
          Create Post
        </Button>
      </VStack>
    </Box>
  );
};
export default BlogForm;
