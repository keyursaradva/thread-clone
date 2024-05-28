import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useEffect, useState } from "react";
import useShowToast from '../hooks/useShowToast';

const UserPage =  () => {

  const [user, setUser] = useState(null);
  const {username} = useParams();
  const showToast = useShowToast();

  useEffect(()=> {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if(data.error){
          showToast("Error",data.error, 'error');
          return;
        };
        setUser(data);
      } catch (error) {
        showToast('Error', error, 'error');
      }
    }
    getUser();
  }, [username, showToast]);

  if(!user) return null;

  return (
    <>
    <UserHeader user={user}/>
    <UserPost likes={456} replies={123} postImg="/post1.png" postTitle="This is my first post !!" />
    <UserPost likes={6445} replies={4544} postImg="/post2.png" postTitle="Leetcode clone tutorial." />
    <UserPost likes={126} replies={10} postImg="/post3.png" postTitle="Musk is my fav person." />
    <UserPost likes={145} replies={322} postTitle="This is my first thread." />
    </>
  )
}

export default UserPage;