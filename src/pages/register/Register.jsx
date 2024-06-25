
import { useState } from "react";
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastOption } from "../../constants";
import RegisterImg from "../../assets/register.jpg";
const Register = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: ""
    })

    const handleChange = (e) => {
        setInputs(prev => ({...prev, [e.target.name] : e.target.value}))
    }
    

    const handleClick = async (e) => {
        e.preventDefault()
        if(!inputs.name || !inputs.email || !inputs.password){
            toast.error("Bạn chưa nhập đủ thông tin" , toastOption);
            return;
        }
        try {
            await axios.post("http://localhost:8800/api/auth/register", inputs)
            toast.success("Đăng ký thành công", toastOption);
            navigate('/login')
        } catch (error) {
            toast.error(error.response.data , toastOption);
        }
    }
    //console.log(err);
    //console.log(inputs);
    return (
        <div className="register">
            <div className="card">
                <div className="left" style={{backgroundImage: `url(${RegisterImg})`}}>
                    <h1>Summer Social.</h1>
                    <p>
                        
                    </p>
                    <span>Bạn đã có tài khoản?</span>
                    <Link to="/login">
                        <button>Đăng nhập</button>
                    </Link>
                    
                </div>
                <div className="right">
                    <h1>Đăng ký</h1>
                    <form>
                        {/* <input type="text" placeholder="Username" name="username" onChange={handleChange}/> */}
                        <input type="email" placeholder="Email" name="email" onChange={handleChange}/>
                        <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
                        <input type="text" placeholder="Name" name="name" onChange={handleChange}/>
                        <button onClick={handleClick}>Đăng ký</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
