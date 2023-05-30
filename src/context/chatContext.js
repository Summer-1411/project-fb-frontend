
import { createContext,  useEffect,  useRef,  useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client"
const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [currentChat, setCurrentChat] = useState()
    const [conversation, setConversation] = useState([])
    const [dataSocket, setDataSocket] = useState([])
    const socket = useRef();
    //console.log({currentUser});

    useEffect(()=>{

        if(currentUser){
            socket.current = io("ws://localhost:8900")
            socket.current.emit("addUser", currentUser.id);
        }
    },[currentUser])
    return (
        <ChatContext.Provider value={{currentChat, setCurrentChat, conversation, setConversation, dataSocket, setDataSocket, socket}}>
            {children}
        </ChatContext.Provider>
    )
}

export {ChatContext}
export default ChatContextProvider