import { useEffect, useRef, useState } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import Message from '../message/Message'
import './chatContainer.scss'
import { makeRequest } from '../../axios';
import { useSelector } from 'react-redux';

export default function ChatContainer({ currentChat, socket }) {

    const currentUser = useSelector((state) => state.user.currentUser);
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState("")
    const scrollRef = useRef();
    const inputRef = useRef();
    const [member, setMember] = useState({})
    const [newMes, setNewMes] = useState(null)
    console.log(messages);
    
    useEffect(() => {
        const getMessage = async () => {
            try {
                const res = await makeRequest.get(`/messages/chat/${currentChat}`)
                setMessages(res.data)
            } catch (error) {
                console.log(error);
            }
        }
        const getMemberChat = async () => {
            try {
                const res = await makeRequest.get(`/chats/member/${currentChat}`)
                setMember(res.data)
            } catch (error) {
                console.log(error);
            }
        }
        getMessage()
        getMemberChat()
    }, [currentChat])
    console.log({ currentUser, member });

    // eslint-disable-next-line no-unused-vars
    const SendMessage = async () => {
        const request = await makeRequest.post("/messages", {
            chatId: currentChat,
            text: message,
            img: null
        })
        await makeRequest.put(`chats/updateLastMessage/${currentChat}`, {
            mes: message
        })
        let receiverId;
        if (member.user_id1 === currentUser.id) {
            receiverId = member.user_id2
        } else {
            receiverId = member.user_id1
        }
        let date = new Date().toISOString();
        socket.current?.emit("sendMessage", {
            chat_id: currentChat,
            deleted: 0,
            img: null,
            profilePic: currentUser.profilePic,
            sentTime: date,
            userSend_id: currentUser.id,
            receiverId: receiverId,
            text: message,
        });
        const resId = await makeRequest.get(`/messages/${request.data.id}`)
        setMessages([...messages, resId.data])
        setMessage("")
        inputRef.current.focus()
    }
    //console.log({messages});
    const handleSend = async () => {
        if (message) {
            const res = await makeRequest.get(`/chats/checkChat/${currentChat}`)
            console.log("Res", res.data);
            if (res.data.length > 0) {
                console.log("Đã nhắn tin !");
                await SendMessage()
            } else {
                console.log("Chưa nhắn tin !");
                await SendMessage()
                await makeRequest.put(`chats/update/${currentChat}`)
            }
        }
    }
    useEffect(() => {
        // socket.current = (io("ws://localhost:8900"))
        socket.current.on("getMessage", (data) => {
            //setMessages(prev => [...prev, data])
            console.log(data);
            setNewMes(data)
            //setMessages(prev => [...prev, data])
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChat])
    useEffect(() => {
        newMes &&
            setMessages((prev) => [...prev, newMes]);
    }, [newMes, currentChat]);
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    }
    //console.log("messages", messages);
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    return (
        <div className='chatcontainer-wrapper'>
            <div className="chatBoxTop">
                {messages.map((mes) => (
                    <div key={mes.id} ref={scrollRef}>
                        <Message message={mes} own={mes.userSend_id === currentUser.id} setMessages={setMessages} />
                    </div>

                ))}

            </div>
            <div className="chatBoxBottom">
                <input
                    ref={inputRef}
                    className="chatMessageInput"
                    placeholder="write something..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <ImageIcon />
                <button className="chatSubmitButton" onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    )
}
