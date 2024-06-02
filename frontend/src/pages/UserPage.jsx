import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import { useEffect, useState } from "react";
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage =  () => {

  const {user, loading} = useGetUserProfile();
  const {username} = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPost, setFatchingPost] = useState(true);

  useEffect(()=> {

    const getPosts = async () => {
      setFatchingPost(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        showToast('Error', error, 'error');
      } finally{
        setFatchingPost(false);
      }
    }

    getPosts();
  }, [username, showToast]);

  if(!user && loading) {
    return(
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />  
      </Flex>
    )
  }
  if(!user && !loading) return <h1>User not found</h1>;

  return (
    <>
    <UserHeader user={user}/>

    {!fetchingPost && posts.length === 0 && <h1>User has 0 posts.</h1>}
    {fetchingPost && (
      <Flex justifyContent={"center"} my={12}>
        <Spinner size="xl" />
      </Flex>
    )}
    {posts.map((post) => (
      <Post key={post._id} post={post} postedBy={post.postedBy} />
    ))}
    </>
  )
}

export default UserPage;