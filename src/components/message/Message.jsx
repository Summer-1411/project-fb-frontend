import { makeRequest } from "../../axios";
import "./message.scss"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
export default function Message({ message, own, setMessages }) {
    const handleDelete = async () => {
        try {
            await makeRequest.delete("/messages/" + message.id)
            setMessages(prev => {
                return prev.map(mes => {
                    if (mes.id === message.id) {
                        return { ...mes, deleted: 1 };
                    } else {
                        return mes;
                    }
                });
            });
        } catch (error) {

        }
    }
    return (
        <div className={own ? "message-wrapper own" : "message-wrapper"}>
            <div className="messageTop">
                <img
                    className="messageImg"
                    src={"../upload/" + message.profilePic}
                    alt=""
                />
                {message.deleted === 0 ? <p className="messageText">{message.text}</p> : <p className="deleted-message">Tin nhắn đã bị gỡ</p>}
                {own && message.deleted===0 && <div className="icon-delete" onClick={handleDelete}>
                    <DeleteOutlineIcon />
                </div>}
            </div>
            <div className="messageBottom">{message.sentTime}</div>
        </div>
    );
}
