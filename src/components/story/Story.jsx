import './story.scss'
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useState } from 'react';
import { useSelector } from 'react-redux';
export default function Story({ story, handleDelete }) {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [menuOpen, setMenuOpen] = useState(false);
    const deleteClick = async () => {
        await handleDelete(story.id)
    }
    return (
        <div className="story">
            <div style={{backgroundImage: `url(../upload/${story.profilePic})`}} alt="" className="avatar-user" />
            {story.img !== '' && <img className='img-story' src={"../upload/" + story.img} alt="" />}
            {story.text !== '' && <p className="text-content">{story.text}</p>}
            <span>{story.name}</span>
            {story.userId === currentUser.id && <MoreHorizIcon className="more-option" onClick={() => setMenuOpen(!menuOpen)} />}
            {menuOpen && story.userId === currentUser.id && (
                <div onClick={deleteClick} className="btn-deleteStory">delete</div>
            )}
        </div>
    )
}
