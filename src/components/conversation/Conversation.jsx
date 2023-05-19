import './conversation.scss'

export default function Conversation({conversation, active}) {
    return (
        <div className={active ? "conversation-wrapper active" : "conversation-wrapper"} >
            <>
                <div className="avatar-container">
                    <img
                        className="conversationImg"
                        src={"../upload/" +conversation.profilePic}
                        alt="avt"
                    />
                    {/* <div className="user-online"></div> */}
                </div>  
                <span className="conversationName">{conversation.name}</span>
            </>
            <p>{conversation.lastMessage}</p>
        </div>
    )
}
