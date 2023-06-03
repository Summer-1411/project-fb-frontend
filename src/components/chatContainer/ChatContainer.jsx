import { useEffect, useRef, useState } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
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
    //const [member, setMember] = useState({})
    const [newMes, setNewMes] = useState(null)
    const [file, setFile] = useState(null)
    // console.log(messages);

    useEffect(() => {
        const getMessage = async () => {
            try {
                const res = await makeRequest.get(`/messages/chat/${currentChat}`)
                setMessages(res.data)
            } catch (error) {
                console.log(error);
            }
        }
        // const getMemberChat = async () => {
        //     try {
        //         const res = await makeRequest.get(`/chats/member/${currentChat}`)
        //         setMember(res.data)
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }
        getMessage()
        //getMemberChat()
    }, [currentChat])

    const upload = async () => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await makeRequest.post("/upload", formData);
            return res.data;
        } catch (err) {
            console.log(err);
        }
    };
    //console.log({messages});
    const handleSend = async () => {
        if (message || file) {
            const res = await makeRequest.get(`/chats/checkChat/${currentChat}`)
            // console.log("Res", res.data);
            let imgUrl = null;
            if (file) imgUrl = await upload();
            if (res.data.length > 0) {
                console.log("Đã nhắn tin !");

                const request = await makeRequest.post("/messages", {
                    chatId: currentChat,
                    text: message,
                    img: imgUrl
                })
                let lastMes = imgUrl ? "Đã gửi một ảnh" : message
                await makeRequest.put(`chats/updateLastMessage/${currentChat}`, {
                    mes: lastMes
                })

                let date = new Date().toISOString();
                // const resId = await makeRequest.get(/messages/${request.data.id})
                // console.log("Check data", resId.data);
                // setMessages(prev => [...prev, resId.data])
                
                inputRef.current.focus()
                socket.current?.emit("sendMessage", {
                    id: request.data.id,
                    chat_id: currentChat,
                    deleted: 0,
                    img: imgUrl,
                    profilePic: currentUser.profilePic,
                    sentTime: date,
                    userSend_id: currentUser.id,
                    text: message,
                });
            } else {
                console.log("Chưa nhắn tin !");
                //console.log("Đã nhắn tin !");
                const request = await makeRequest.post("/messages", {
                    chatId: currentChat,
                    text: message,
                    img: imgUrl
                })
                let lastMes = imgUrl ? "Đã gửi một ảnh" : message

                await makeRequest.put(`chats/updateLastMessage/${currentChat}`, {
                    mes: lastMes
                })

                let date = new Date().toISOString();
                const resId = await makeRequest.get(`/messages/${request.data.id}`)
                //console.log("Check data", resId.data);
                setMessages(prev => [...prev, resId.data])
                
                inputRef.current.focus()
                socket.current?.emit("sendMessage", {
                    id: request.data.id,
                    chat_id: currentChat,
                    deleted: 0,
                    img: imgUrl,
                    profilePic: currentUser.profilePic,
                    sentTime: date,
                    userSend_id: currentUser.id,
                    text: message,
                });
                await makeRequest.put(`chats/update/${currentChat}`)
            }
            setMessage("")
            setFile(null);
        }
    }
    useEffect(() => {
        socket.current.on("getMessage", (data) => {
            setNewMes(data)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        newMes &&
            setMessages((prev) => [...prev, newMes]);
    }, [newMes]);
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    }
    console.log("messages", messages);
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    const handleCloseFile = (e) => {
        e.preventDefault();
        setFile(null)
    }
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
                <div className="right">
                    <input
                        ref={inputRef}
                        className="chatMessageInput"
                        placeholder="write something..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    {file && (
                        <div className="container-img-message">
                            <div className="img-message" alt="" style={{ backgroundImage: `url(${URL.createObjectURL(file)})` }}>
                                <HighlightOffIcon className='btn-close' onClick={handleCloseFile} />
                            </div>
                        </div>
                    )}
                </div>
                <input type="file" id="file-message" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
                <label htmlFor="file-message" style={{ cursor: "pointer" }}>
                    <ImageIcon />
                </label>

                <button className="chatSubmitButton" onClick={handleSend}>
                    Send
                </button>

            </div>
        </div>
    )
}