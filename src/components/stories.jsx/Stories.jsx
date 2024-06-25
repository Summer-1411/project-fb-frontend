
import { Link } from "react-router-dom";
import "./stories.scss"
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { makeRequest } from "../../axios";

import Story from "../story/Story";
const Stories = () => {
    const [stories, setStories] = useState([])
    const currentUser = useSelector((state) => state.user.currentUser);
    // const [menuOpen, setMenuOpen] = useState(false);
    useEffect(() => {
        const getStories = async () => {
            const res = await makeRequest.get("/stories")
            //console.log({res});
            setStories(res.data.story)
        }
        getStories()
    }, [currentUser])
    //TEMPORARY
    
    const handleDelete =async (id) => {
        await makeRequest.delete(`/stories/${id}`)
        setStories(prev => prev.filter((story) => story.id !== id))
    };
    return (
        <div className="stories">
            <div className="story-list">

                <div className="story">
                    <img src={"../upload/" + currentUser.profilePic} alt="" />
                    <span>{currentUser.name}</span>
                    <Link to={"/stories/create"}>
                        <button>+</button>
                    </Link>
                    
                </div>
                {stories.map(story => (
                    <Story key={story.id} story={story} handleDelete={handleDelete}/>
                ))}
            </div>
        </div>
    )
}

export default Stories