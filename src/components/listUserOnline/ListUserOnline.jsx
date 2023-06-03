import { useContext } from 'react';
import { makeRequest } from '../../axios';
import './listUserOnline.scss'
import { ChatContext } from '../../context/chatContext';

export default function ListUserOnline({friendOnline}) {
    const {  setCurrentChat, setConversation } = useContext(ChatContext)

    console.log(friendOnline);
    const handleSelectChat = async (user) => {
        //console.log("Member : ",userId);
        const res = await makeRequest.get(`/chats/find?member=${user.id}`)
        console.log(res.data);
        if(res.data.length > 0){
            setCurrentChat(res.data[0].id)
        }else{
            const request = await makeRequest.post(`/chats/create`, {
                receiver: user.id
            })
            let idChat = request.data.chatId
            setConversation(prev => [{
                id: user.id,
                idChat: idChat,
                name: user.name,
                profilePic: user.profilePic,
                username: user.username
            },...prev])
            
            setCurrentChat(idChat)
        }
    }
    return (
        <div className="chatOnline">
                <div className="chatOnlineWrapper">
                    <h3>Đang hoạt động</h3>
                    {friendOnline?.map((online) => (
                        <div key={online.id} className="userOnline-item" onClick={() => handleSelectChat(online)}>
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
    )
}
