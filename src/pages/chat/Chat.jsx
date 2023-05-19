import "./chat.scss";
import Welcome from "../../components/welcome/Welcome";
import SearchIcon from '@mui/icons-material/Search';
import Conversation from "../../components/conversation/Conversation";
import ChatContainer from "../../components/chatContainer/ChatContainer";
import { useContext, useEffect, useState } from "react";

import { ChatContext } from "../../context/chatContext";
import { makeRequest } from "../../axios";
import { useSelector } from "react-redux";
export default function Chat() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [online, setOnline] = useState([])
    const [friends, setFriends] = useState([])
    const [friendOnline, setFriendOnline] = useState([])
    const { currentChat, setCurrentChat, conversation, socket } = useContext(ChatContext)
    const handleClickConversation = (conversation) => {
        setCurrentChat(conversation.idChat)
    }
    console.log({ conversation });
    useEffect(() => {
        const getFriends = async () => {
            try {
                const res = await makeRequest.get(`/users/follow?id=${currentUser.id}`)
                setFriends(res.data.users)
            } catch (error) {
                setFriends([])
            }
            // setFriends(res.data.users)
        }
        getFriends();
    }, [currentUser.id])
    useEffect(() => {
        // socket.current = (io("ws://localhost:8900"))
        socket.current?.on("getUsers", (data) => {
            //setMessages(prev => [...prev, data])
            console.log("online", data);
            setOnline(data)
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    useEffect(() => {
        setFriendOnline(friends.filter(user => online.some(onlineUser => onlineUser.userId === user.id)))
    }, [friends, online])
    //const matchedUsers = friends.filter(user => online.some(onlineUser => onlineUser.userId === user.id));
    //console.log({matchedUsers});
    return (

        <div className="chat-wrapper">
            <div className="chatMenu">
                <div className="heading-menu-chat">
                    <input type="text" className="search-user" placeholder="Tìm kiếm người dùng" />
                    <div className="btn-search"><SearchIcon /></div>
                </div>
                <div className="list-conversation">
                    {conversation.map((conversation) => (
                        <div key={conversation.idChat} onClick={() => handleClickConversation(conversation)}>
                            <Conversation conversation={conversation} active={currentChat === conversation.idChat} />
                        </div>
                    ))}

                </div>
            </div>
            <div className="chatBox">

                {currentChat ? (
                    <ChatContainer currentChat={currentChat} socket={socket} />
                ) : (
                    <Welcome />
                )}

            </div>
            <div className="chatOnline">
                <div className="chatOnlineWrapper">
                    <h3>User Online</h3>
                    {friendOnline?.map((online) => (
                        <div key={online.id} className="userOnline-item">
                            <div className="avatar-container">
                                <img
                                    className="conversationImg"
                                    src={"../upload/" + online.profilePic}
                                    alt="avt"
                                />
                                <div className="user-online"></div>
                            </div>
                            <span className="conversationName">{online.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}