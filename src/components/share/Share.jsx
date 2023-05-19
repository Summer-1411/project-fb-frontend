import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { makeRequest } from "../../axios";
import { useSelector } from "react-redux";
import { PostContext } from "../../context/postContext";

const Share = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const {setPosts } = useContext(PostContext)
    const [file, setFile] = useState(null)
    const [desc, setDesc] = useState('')

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
    // const queryClient = useQueryClient();

    // const mutation = useMutation(
    //     (newPost) => {
    //         return makeRequest.post("/posts", newPost);
    //     },
    //     {
    //         onSuccess: () => {
    //             // Invalidate and refetch
    //             queryClient.invalidateQueries(["posts"]);
    //         },
    //     }
    // );
    const handleClick = async (e) => {
        e.preventDefault()
        let imgUrl = "";
        if (file) imgUrl = await upload();
        const res = await makeRequest.post("/posts", { desc, img: imgUrl });
        let date = Date.now()
        console.log(res.data);
        const newPost = {
            id: res.data.id, 
            description: desc, 
            img: imgUrl, 
            userId: currentUser.id, 
            createdAt: date,
            name: currentUser.name,
            profilePic: currentUser.profilePic
        }
        setPosts(prev => [newPost, ...prev])
        setDesc("");
        setFile(null);
    }
    
    //const currentUser = useSelector((state) => state.user.currentUser);
    return (
        <div className="share">
            <div className="container">
                <div className="top">
                    <div className="left">
                        <img src={"../upload/" + currentUser.profilePic} alt="" />
                        <input
                            type="text"
                            placeholder={`${currentUser.name} ơi, bạn đang nghĩ gì thế?`}
                            onChange={(e) => setDesc(e.target.value)}
                            value={desc}
                        />
                    </div>
                    <div className="right">
                        {file && (
                            <img className="file" alt="" src={URL.createObjectURL(file)} />
                        )}
                    </div>
                </div>
                <hr />
                <div className="bottom">
                    <div className="left">
                        <input type="file" id="file" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
                        <label htmlFor="file">
                            <div className="item">
                                <img src={Image} alt="" />
                                <span>Ảnh</span>
                            </div>
                        </label>
                        <div className="item">
                            <img src={Map} alt="" />
                            <span>Địa điểm</span>
                        </div>
                        <div className="item">
                            <img src={Friend} alt="" />
                            <span>Gắn thẻ</span>
                        </div>
                    </div>
                    <div className="right">
                        <button onClick={handleClick}>Chia sẻ</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Share;
