import { useEffect, useState } from "react";
import "./comments.scss";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { makeRequest } from "../../axios";
import moment from "moment";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Comments = ({ postId, setComments }) => {
    const [desc, setDesc] = useState("");
    const [cmt, setCmt] = useState([]);


    const currentUser = useSelector((state) => state.user.currentUser);


    const getComments = async () => {
        try {
            const res = await makeRequest.get("/comments?postId=" + postId)
            setCmt(res.data)
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {

        getComments()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId])


    const handleClick = async (e) => {
        e.preventDefault();
        await makeRequest.post("/comments", { desc, postId })
        setComments(prev => prev + 1)
        getComments()
        setDesc("");
        console.log("Send cmt");
    };
    const handleDeleteCmt = async (id) => {
        await makeRequest.delete(`/comments/${id}`)
        setComments(prev => prev - 1)
        setCmt(prev => prev.filter((cmt) => cmt.id !== id))
    }

    return (
        <div className="comments">
            <div className="write">
                <img src={"../upload/" + currentUser.profilePic} alt="" />
                <input
                    type="text"
                    placeholder="write a comment"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />
                <button onClick={handleClick}>Send</button>
            </div>
            {cmt.map((comment) => (
                <div key={comment.id} className="comment">
                    <img src={"/upload/" + comment.profilePic} alt="" />
                    <Link className="info" to={`/profile/${comment.userId}`}>
                        <span>{comment.name}</span>
                        <p>{comment.description}</p>
                    </Link>
                    <span className="date">
                        {moment(comment.createdAt).fromNow()}
                    </span>
                    {comment.userId === currentUser.id && (
                        <DeleteOutlineIcon onClick={() => handleDeleteCmt(comment.id)}/>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Comments;
