import { Flex, Spinner } from "@chakra-ui/react"
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import Post from "../components/Post";

function HomePage() {
  const [posts, setPosts]= useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  useEffect(() => {
    const getFeedPosts= async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if(data.error){
          showToast("Error",data.error,"error");
          return
        }
        setPosts(data);
      } catch (error) {
        showToast("Error",error,"error");
      } finally{
        setLoading(false);
      }
    }
    getFeedPosts();
  }, [showToast])
  

  return (
    <>
      {!loading && posts.length === 0 && <h1>Follow some users to see the Feed.</h1>}
      {loading && (
        <Flex justify="center">
          <Spinner size='xl' />
        </Flex>
      )}
      {posts.map((post)=>(
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  )
}

export default HomePage;