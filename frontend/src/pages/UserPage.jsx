import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"

export default function UserPage() {
  return (
    <>
    <UserHeader />
    <UserPost likes={456} replies={123} postImg="/post1.png" postTitle="This is my first post !!" />
    <UserPost likes={6445} replies={4544} postImg="/post2.png" postTitle="Leetcode clone tutorial." />
    <UserPost likes={126} replies={10} postImg="/post3.png" postTitle="Musk is my fav person." />
    <UserPost likes={145} replies={322} postTitle="This is my first thread." />
    </>
  )
}
