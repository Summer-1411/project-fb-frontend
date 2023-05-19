import { Link, useParams } from "react-router-dom";
import "./rightbar.scss";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { makeRequest } from "../../axios";

const RightBar = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const userId = Number(useParams().id)
    const [friends, setFriends] = useState([])
    const [follower, setFollower] = useState([])
    // console.log({ userId });
    // console.log({ currentUser });
    useEffect(() => {
        const getFriends = async () => {
            const res = userId ?
                await makeRequest.get(`/users/follow?id=${userId}`) :
                await makeRequest.get(`/users/follow?id=${currentUser.id}`)
            setFriends(res.data.users)
        }
        const getFollower = async () => {
            const res = userId ?
                await makeRequest.get(`/users/followed?id=${userId}`) :
                await makeRequest.get(`/users/followed?id=${currentUser.id}`)
            setFollower(res.data.users)
        }
        getFriends();
        getFollower();
    }, [currentUser.id, userId])
    return (
        <div className="rightBar">
            <div className="container">
                <div className="item">
                    <span>Đang theo dõi</span>
                    {friends.length > 0 ? friends.map((friend) => (
                        <Link to={`/profile/${friend.id}`} className="user" key={friend.id}>
                            <div className="userInfo">
                                <img
                                    src={"../upload/" + friend.profilePic}
                                    alt=""
                                />
                                <span>{friend.name}</span>
                            </div>
                        </Link>
                    )) : <p>Danh sách trống</p>}
                    <div></div>
                    <span>Người theo dõi</span>
                    {follower.length > 0 ? follower.map((friend) => (
                        <Link to={`/profile/${friend.id}`} className="user" key={friend.id}>
                            <div className="userInfo">
                                <img
                                    src={"../upload/" + friend.profilePic}
                                    alt=""
                                />
                                <span>{friend.name}</span>
                            </div>
                        </Link>
                    )) : <p>Danh sách trống</p>}
                </div>
            </div>
        </div>
    );
};

export default RightBar;

