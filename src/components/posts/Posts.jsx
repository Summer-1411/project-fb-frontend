import Post from "../post/Post";
import "./posts.scss";
import { makeRequest } from "../../axios";
import { useContext, useEffect } from "react";
import { PostContext } from "../../context/postContext";
import { useParams } from "react-router-dom";
const Posts = () => {
    const id = Number(useParams().id) || undefined
    const { posts, setPosts } = useContext(PostContext)
    //console.log({id});
    useEffect(() => {
        const getPosts = async () => {
            const res = await makeRequest.get("/posts?userId=" + id)
            //console.log("API", res.data);
            setPosts(res.data)
        }
        getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])
    //console.log(posts);
    const handleDeletePost = async (id) => {
        setPosts(prev => prev.filter((post) => post.id !== id))
        await makeRequest.delete("/posts/" + id);
    }

    return <div className="posts">
        {posts.map(post => (
            <Post post={post} key={post.id} handleDeletePost={handleDeletePost}/>
        ))}
    </div>;
};

export default Posts;
