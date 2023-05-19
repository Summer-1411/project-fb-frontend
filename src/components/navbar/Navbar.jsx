import "./navbar.scss"
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import HeadlessTippy from '@tippyjs/react/headless';
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/userRedux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastOption } from "../../constants";
import axios from "axios";
import { ChatContext } from "../../context/chatContext";
import { makeRequest } from "../../axios";
import useDebounce from "../../hooks/useDebounce";
import RotateRightOutlinedIcon from '@mui/icons-material/RotateRightOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useRef } from "react";
const result = [
    {
        id: 1,
        name: "Quynh Anh",
        profilePic: "default.jpg",
    },
    {
        id: 2,
        name: "Quynh Em",
        profilePic: "default.jpg",
    }
]
export default function NavBar() {
    const { socket } = useContext(ChatContext)
    const { toggle, darkMode } = useContext(DarkModeContext)
    const currentUser = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();
    const [name, setName] = useState("")
    const [resultSearch, setResultSearch] = useState([])
    const [isShow, setIsShow] = useState(true)
    const [loading, setLoading] = useState(false);
    let debounced = useDebounce(name, 500);
    const inputRef = useRef()
    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8800/api/auth/logout")
            dispatch(logout())
            socket.current.emit("disconnect-user", currentUser.id)
            toast.success("Bạn đã đăng xuất thành công", toastOption)
        } catch (error) {
            toast.error("Có lỗi trong quá trình đăng xuất !", toastOption)
        }
    }
    const handleSearch = async () => {
        try {
            const res = await makeRequest.get("/users/search?name=" + name)
            setResultSearch(res.data)
        } catch (error) {
            toast.error("Có lỗi trong quá trình tìm kiếm !", toastOption)
        }
    }
    useEffect(() => {
        if (!debounced.trim()) {
            setResultSearch([]);
            return;
        }

        const fetchApi = async () => {
            setLoading(true);
            const result = await makeRequest.get("/users/search?name=" + name)
            //console.log(result);
            setResultSearch(result.data)
            setLoading(false);
        };
        fetchApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);
    const handleChange = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setName(searchValue);
        }
    };
    const handleHideResult = () => {
        setIsShow(false);
    };
    const handleClear = () => {
        setName('');
        setResultSearch([]);
        inputRef.current.focus();
    };
    return (
        <div className="navbar">
            <div className="left">
                <Link to="/" className="logoApp">
                    SummerSocial
                </Link>
                <HomeOutlinedIcon />
                {darkMode ?
                    <WbSunnyOutlinedIcon onClick={toggle} />
                    :
                    <DarkModeOutlinedIcon onClick={toggle} />
                }

                <GridViewOutlinedIcon />
                <div className="navbar-center">
                    <HeadlessTippy
                        visible={resultSearch.length > 0 && isShow}
                        interactive
                        render={(attrs) => (
                            <div className="result-searrch" tabIndex="-1" {...attrs}>
                                {resultSearch.map((user) => (
                                    <Link to={`/profile/${user.id}`} key={user.id} className="user-item" onClick={() => setResultSearch([])}>
                                        <img className="user-item-img" src={"../upload/" + user.profilePic} alt="" />
                                        <span className="user-item-name">{user.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                        onClickOutside={handleHideResult}
                    >
                        <div className="search">
                            <SearchOutlinedIcon onClick={handleSearch} />
                            <input
                                placeholder="Tìm kiếm...."
                                value={name}
                                onChange={handleChange}
                                onFocus={() => setIsShow(true)}
                                ref={inputRef}
                            />
                            {!!name && !loading && (
                                <ClearOutlinedIcon className="clear" onClick={handleClear} />
                            )}
                            {loading && (
                                <RotateRightOutlinedIcon className="loading" />
                            )}
                        </div>
                        {/* <div className="result-searrch">
                            {resultSearch.length > 0 && isShow && resultSearch.map((user) => (
                                <Link to={`/profile/${user.id}`} key={user.id} className="user-item" onClick={() => setResultSearch([])}>
                                    <img className="user-item-img" src={"../upload/" + user.profilePic} alt="" />
                                    <span className="user-item-name">{user.name}</span>
                                </Link>
                            ))}
                        </div> */}
                    </HeadlessTippy>
                </div>
            </div>
            <div className="right">
                <PersonOutlinedIcon />
                <Link to={"/chat"} style={{ color: "inherit" }}>
                    <EmailOutlinedIcon />
                </Link>
                <NotificationsOutlinedIcon />
                
                <Link className="user"
                    to={`/profile/${currentUser.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                >
                    <img src={"../upload/" + currentUser.profilePic} alt="" />
                    <span>{currentUser.name}</span>
                </Link>
                <div className="btn-logout" onClick={handleLogout}>Đăng xuất</div>
            </div>
        </div>
    )
}
