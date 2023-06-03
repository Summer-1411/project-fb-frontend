
import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import {useEffect, useState } from "react";
import moment from "moment";
import { makeRequest } from "../../axios";
import { useSelector } from "react-redux";

const Post = ({ post, handleDeletePost }) => {
    //console.log(post.userId);
    const [commentOpen, setCommentOpen] = useState(false);
    const [likes, setLikes] = useState([])
    const [comments, setComments] = useState(0)
    const [menuOpen, setMenuOpen] = useState(false);
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const currentUser = useSelector((state) => state.user.currentUser);
    const getLikes = async () => {
        try {
            const res = await makeRequest.get(`/likes?postId=${post.id}`)

            setLikes(res.data)
        } catch (error) {
            console.log(error);
        }
    }
    const getComments = async () => {
        try {
            const res = await makeRequest.get(`/comments?postId=${post.id}`)
            setComments(res.data.length)
        } catch (error) {
            console.log(error);
        }
    }
    //console.log('re-render');
    useEffect(() => {
        getLikes()
        getComments()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post.id])



    const handleDelete = () => {
        handleDeletePost(post.id)
        //deleteMutation.mutate(post.id);
    };
    const handleLike = async () => {
        let liked = likes.includes(currentUser.id)
        if (liked) {
            try {
                setLikes(prev => prev.filter(like => like !== currentUser.id))
                await makeRequest.delete(`/likes?postId=${post.id}`)
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                setLikes(prev => [...prev, currentUser.id])
                await makeRequest.post(`/likes`, { postId: post.id })
            } catch (error) {
                console.log(error);
            }
        }

    }
    return (
        <div className="post">
            {post &&
                <div className="container">
                    <div className="user">
                        <Link className="userInfo"
                            to={`/profile/${post.userId}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <img src={"../upload/" +post.profilePic} alt="" />
                            <div className="details">
                                <span className="name">{post.name}</span>
                                <span className="date">{capitalizeFirstLetter(moment(post.createdAt).fromNow())}</span>
                            </div>
                        </Link>
                        {post.userId === currentUser.id && <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />}
                        
                        {menuOpen && post.userId === currentUser.id && (
                            <button onClick={handleDelete}>delete</button>
                        )}
                    </div>
                    <div className="content">
                        <p>{post.description}</p>
                        <img src={"../upload/" + post.img} alt="" />
                    </div>
                    <div className="info">
                        <div className="item">
                            {likes.includes(currentUser.id) ?
                                <FavoriteOutlinedIcon style={{ color: 'red' }} onClick={handleLike} />
                                : <FavoriteBorderOutlinedIcon onClick={handleLike} />
                            }
                            {likes.length} Thích
                        </div>
                        <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
                            <TextsmsOutlinedIcon />
                            {comments} Bình luận
                        </div>
                        <div className="item">
                            <ShareOutlinedIcon />
                            Chia sẻ
                        </div>
                    </div>
                    {commentOpen && <Comments postId={post.id} setComments={setComments}/>}
                </div>
            }

        </div>
    );
};

export default Post;
