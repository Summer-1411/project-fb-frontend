import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/userRedux";

const Update = ({ setOpenUpdate}) => {

    const currentUser = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch()
    const [cover, setCover] = useState(null);
    const [profile, setProfile] = useState(null);
    //console.log({user});
    const [texts, setTexts] = useState({
        email: currentUser.email,
        name: currentUser.name,
        city: currentUser.city,
        website: currentUser.website,
    });
    console.log(texts);

    const upload = async (file) => {
        console.log(file)
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await makeRequest.post("/upload", formData);
            return res.data;
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // const queryClient = useQueryClient();

    // const mutation = useMutation(
    //     (user) => {
    //         return makeRequest.put("/users", user);
    //     },
    //     {
    //         onSuccess: () => {
    //             // Invalidate and refetch
    //             queryClient.invalidateQueries(["user"]);
    //         },
    //     }
    // );

    const handleClick = async (e) => {
        e.preventDefault();

        //TODO: find a better way to get image URL

        let coverUrl;
        let profileUrl;
        coverUrl = cover ? await upload(cover) : currentUser.coverPic;
        profileUrl = profile ? await upload(profile) : currentUser.profilePic;
        //setCurrentUser((prev) => ({...prev,...texts, coverPic: coverUrl, profilePic: profileUrl}))
        await makeRequest.put("/users", {...texts, coverPic: coverUrl, profilePic: profileUrl });
        dispatch(updateUser({...texts, coverPic: coverUrl, profilePic: profileUrl }))
        //mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
        setOpenUpdate(false);
        setCover(null);
        setProfile(null);
    }

        return (
            <div className="update">
                <div className="wrapper">
                    <h1>Update Your Profile</h1>
                    <form>
                        <div className="files">
                            <label htmlFor="cover">
                                <span>Cover Picture</span>
                                <div className="imgContainer">
                                    <img
                                        src={
                                            cover
                                                ? URL.createObjectURL(cover)
                                                : "../upload/" + currentUser.coverPic
                                        }
                                        alt=""
                                    />
                                    <CloudUploadIcon className="icon" />
                                </div>
                            </label>
                            <input
                                type="file"
                                id="cover"
                                style={{ display: "none" }}
                                onChange={(e) => setCover(e.target.files[0])}
                            />
                            <label htmlFor="profile">
                                <span>Profile Picture</span>
                                <div className="imgContainer">
                                    <img
                                        src={
                                            profile
                                                ? URL.createObjectURL(profile)
                                                : "/upload/" + currentUser.profilePic
                                        }
                                        alt=""
                                    />
                                    <CloudUploadIcon className="icon" />
                                </div>
                            </label>
                            <input
                                type="file"
                                id="profile"
                                style={{ display: "none" }}
                                onChange={(e) => setProfile(e.target.files[0])}
                            />
                        </div>
                        <label>Email</label>
                        <input
                            type="text"
                            value={texts.email}
                            name="email"
                            onChange={handleChange}
                        />
                        <label>Name</label>
                        <input
                            type="text"
                            value={texts.name}
                            name="name"
                            onChange={handleChange}
                        />
                        <label>Country / City</label>
                        <input
                            type="text"
                            name="city"
                            value={texts.city}
                            onChange={handleChange}
                        />
                        <label>Website</label>
                        <input
                            type="text"
                            name="website"
                            value={texts.website}
                            onChange={handleChange}
                        />
                        <button onClick={handleClick}>Update</button>
                    </form>
                    <button className="close" onClick={() => setOpenUpdate(false)}>
                        close
                    </button>
                </div>
            </div>
        );
};

    export default Update;
