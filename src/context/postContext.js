import { createContext, useState } from "react";

export const PostContext = createContext()

export const PostContextProvider = ({ children }) => {
    const [posts, setPosts] = useState([])
    
    return (
        <PostContext.Provider value={{ posts, setPosts }}>{children}</PostContext.Provider>
    )
}