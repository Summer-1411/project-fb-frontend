
import { useSelector } from 'react-redux';
import robot from '../../assets/robot.gif'
import "./welcome.scss"
function Welcome( ) {
    const currentUser = useSelector((state) => state.user.currentUser);
    return ( 
    <div className='welcome-wrapper'>
        <img src={robot} alt="" className='img-robot-chat'/>
        <h1 className='heading-welcome-chat'>
            Welcome, <span>{currentUser.name}</span>
        </h1>
        <h3 className='text-welcome-chat'>Please select a chat to Messaging</h3>
    </div> );
}

export default Welcome;