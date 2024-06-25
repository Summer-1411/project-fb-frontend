import { useSelector } from "react-redux";
import "./createStory.scss"
import ImageIcon from '@mui/icons-material/Image';
import { useEffect, useState } from "react";
import { makeRequest } from "../../axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastOption } from "../../constants";
export default function CreateStory() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [option, setOption] = useState()
    const [file, setFile] = useState(null)
    const [text, setText] = useState("")
    const [cancel, setCancel] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        file && setOption("img")
    }, [file])
    console.log("option.", option, file);

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
    const handleCancel = () => {
        setOption(undefined)
        setFile(null)
        setCancel(false)
        setText("")
    }
    const handleShareStory = async (e) => {
        e.preventDefault()
        let img = "";
        if (file) img = await upload();
        //console.log({img});
        try {
            await makeRequest.post("/stories", {
                img: img,
                text: text
            });
            toast.success("Thêm mới tin thành công !", toastOption)
            navigate("/")
        } catch (error) {
            toast.error("Có lỗi xảy ra trong quá trình chia sẻ tin", toastOption)
        }
        
    }
    const handleHomeBack = () => {
        navigate("/")
    }
    return (
        <div className='wrapper-createStory'>
            <div className="left-bar">
                <div className="title-left-bar">
                    <div className="heading-title">
                        Tin của bạn
                    </div>
                    <div className="btn-close" onClick={handleHomeBack}>
                        X
                    </div>
                </div>
                <div className="user-create-story">
                    <img src={"../upload/" + currentUser.profilePic} alt=""
                        className="avatar-user" />
                    <div className="name-user">
                        {currentUser.name}
                    </div>
                </div>
                {option === "text" &&
                    <div className="text-story">
                        <div className="heading-input">Văn bản</div>
                        <textarea className="input-text" placeholder="Bắt đầu nhập" value={text} onChange={(e) => setText(e.target.value)} />
                    </div>
                }

                {option &&
                    <div className="bottom-leftbar">
                        <div className="btn btn-cancel" onClick={() => setCancel(true)}>Huỷ bỏ</div>
                        <div className="btn btn-share" onClick={handleShareStory}>Chia sẻ lên tin</div>
                    </div>
                }
            </div>
            <div className="content">
                <div className="main-content">
                    <input type="file" id="file" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
                    <label htmlFor="file" className="item-content item-img">
                        <div className="btn-icon-create">
                            <ImageIcon />
                        </div>
                        <div className="title-create-story">
                            Tạo tin ảnh
                        </div>
                    </label>
                    <div className="item-content item-text" onClick={() => setOption("text")}>
                        <div className="btn-icon-create">
                            Aa
                        </div>
                        <div className="title-create-story">
                            Tạo tin dạng văn bản
                        </div>
                    </div>
                </div>
                {option && <div className="overview">
                    <div className="title-overview">Xem trước</div>
                    <div className="back-ground">
                        <div className="content-overview">
                            {option === "text" && <div className="text-content">
                                {text}
                            </div>}

                            {file && option === "img" && (
                                <img className="img-content" alt="" src={URL.createObjectURL(file)} />
                            )}


                        </div>
                    </div>
                </div>}
            </div>
            {
                cancel &&
                <div className="overlay">
                    <div className="container">
                        <div className="heading-message">
                            Bỏ tin ?
                        </div>
                        <div className="main-message">
                            <div className="description">Bạn có chắc chắn muốn bỏ tin này không? Hệ thống sẽ không lưu tin của bạn.</div>

                            <div className="list-btn">
                                <div className="btn-message continue" onClick={() => setCancel(false)}>Tiếp tục chỉnh sửa</div>
                                <div className="btn-message cancel"onClick={handleCancel}>Bỏ</div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
