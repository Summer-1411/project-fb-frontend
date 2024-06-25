import "./chat.scss";
import Welcome from "../../components/welcome/Welcome";
import SearchIcon from '@mui/icons-material/Search';
import Conversation from "../../components/conversation/Conversation";
import ChatContainer from "../../components/chatContainer/ChatContainer";
import { useContext, useEffect, useState } from "react";

import { ChatContext } from "../../context/chatContext";
import { makeRequest } from "../../axios";
import { useSelector } from "react-redux";
import ListUserOnline from "../../components/listUserOnline/ListUserOnline";
export default function Chat() {
    
    const currentUser = useSelector((state) => state.user.currentUser);
    const [friends, setFriends] = useState([])
    const [friendOnline, setFriendOnline] = useState([])
    
    const { currentChat, setCurrentChat, conversation, setConversation, dataSocket, setDataSocket, socket } = useContext(ChatContext)
    const handleClickConversation = (conversation) => {
        socket.current?.emit('join room', conversation.idChat);
        setCurrentChat(conversation.idChat)
    }
    useEffect(() => {
        currentChat && socket.current?.emit('join room', currentChat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChat])
    useEffect(() => {
        const getAllConversation = async () => {
            const res = await makeRequest.get("/chats")
            //console.log(res.data);
            setConversation(res.data)
        }
        currentUser && setCurrentChat(undefined)
        getAllConversation()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])
    //console.log({ conversation });
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
        socket.current?.on("getUsers", (data) => {
            setDataSocket(data)
            console.log("Dang nhap xong get online");
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])
    useEffect(() => {
        setFriendOnline(friends.filter(user => dataSocket.some(onlineUser => onlineUser.userId === user.id)))
    }, [dataSocket, friends])

    console.log('conversation',conversation);
    // useEffect(() => {

    // }, [online])
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
            <ListUserOnline friendOnline={friendOnline} />
        </div>
    );
}