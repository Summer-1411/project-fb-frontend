import {  useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./login.scss"
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../../redux/userRedux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastOption } from "../../constants";
import LoginImg from "../../assets/login.jpg";
import { ChatContext } from "../../context/chatContext";
function Login() {
    const dispatch = useDispatch()
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })
    
    const handleChange = (e) => {
        setInputs(prev => ({...prev, [e.target.name] : e.target.value}))
    }
    const hanleLogin = async (e) => {
        e.preventDefault()
        if(!inputs.email || !inputs.password){
            toast.error('Vui lòng nhập đủ thông tin !', toastOption);
            return
        }
        try {
            dispatch(loginStart())
            const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
                withCredentials: true,
            })
            toast.success("Đăng nhập thành công", toastOption);
            dispatch(loginSuccess(res.data))
        } catch (error) {
            toast.error(error.response, toastOption);
            dispatch(loginFailure())
        }
    }
    return ( 
        <div className="login">
            <div className="card">
                <div className="left" style={{backgroundImage: `url(${LoginImg})`}}>
                    <h1>Summer Social.</h1>
                    <p>
                    Đăng nhập để trải nghiệm toàn bộ tính năng của website.
                    </p>
                    <span>Bạn chưa có tài khoản?</span>
                    <Link to="/register">
                        <button>Đăng ký</button>
                    </Link>
                </div>
                <div className="right">
                    <h1>Đăng nhập</h1>
                    <form>
                        <input type="text" placeholder="Email" name="email" onChange={handleChange} />
                        <input type="password" placeholder="Password" name="password" onChange={handleChange} />
                        <button onClick={hanleLogin}>Đăng nhập</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;