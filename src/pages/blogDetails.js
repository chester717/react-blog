import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import db from "../firebase";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { Divider, Heading, Spinner } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

const cld = new Cloudinary({
  cloud: {
    cloudName: "dki3jsvdj",
  },
});

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const ref = doc(db, "blogs", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setBlog(snap.data());
      }
      setLoading(false);
    };
    fetchBlog();
  }, [id, setBlog, setLoading]);

  if (loading) {
    return (
      <Box p={6}>
        <Spinner />
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box p={6}>
        <Text>Blog not found.</Text>
      </Box>
    );
  }

  const img = blog.imageUrl
    ? cld
        .image(blog.imageUrl)
        .format("auto")
        .quality("auto")
        .resize(auto().gravity(autoGravity()).width(600).height(300))
    : null;

  return (
    <Box maxW="3x1" mx="auto" p={6}>
      <button
        leftIcon={<ArrowBackIcon />}
        colorScheme="teal"
        variant="ghost"
        mb={4}
        onClick={() => navigate("/")}
      />
      {img && (
        <AdvancedImage
          cldImg={img}
          style={{ width: "100%", borderRadius: "8px", marginBottom: "16px" }}
        />
      )}
      <Heading mb={2}>{blog.title}</Heading>
      <Text color="gray.500" mb={4}>
        {blog.date}
      </Text>
      <Divider mb={4} />
      <Text fontSize="lg" color="gray.700">
        {blog.content}
      </Text>
    </Box>
  );
};

export default BlogDetails;
