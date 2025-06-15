import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Heading } from "@chakra-ui/react";
import BlogList from "./pages/blogList";



const App = () => {
  return (
    <Router>
      <Container maxW={"container.md"} py={8}>
        <Heading mb={6}>Blog</Heading>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/home" element={<BlogList />} />
          <Route />
        </Routes>
      </Container>
    </Router>
  )
};

export default App