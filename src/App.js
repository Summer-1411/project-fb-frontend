


import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Home from './pages/home/Home';
import NavBar from './components/navbar/Navbar';
import LeftBar from './components/leftbar/Leftbar';
import RightBar from './components/rightbar/Rightbar';
import Profile from './pages/profile/Profile';
import Chat from './pages/chat/Chat'
import './style.scss';
import { DarkModeContext } from "./context/darkModeContext";
import { useContext, useEffect } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { makeRequest } from "./axios";
import { ChatContext } from "./context/chatContext";
import CreateStory from "./components/createStory/CreateStory";

function App() {
  
  
  const currentUser = useSelector((state) => state.user.currentUser);
  const {setConversation,setCurrentChat } = useContext(ChatContext)
  
  useEffect(() => {
    const getAllConversation = async () => {
        const res = await makeRequest.get("/chats")
        //console.log(res.data);
        setConversation(res.data)
    }
    currentUser && setCurrentChat(undefined)
    getAllConversation()
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentUser])
  const {darkMode} = useContext(DarkModeContext)
  const queryClient = new QueryClient()
  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <NavBar />
          <div style={{display:"flex"}}>
            <LeftBar />
            <div style={{flex:6}}>
              <Outlet />
            </div>
            <RightBar />
          </div>
        </div>
      </QueryClientProvider>
    )
  }
  const HeaderLayout = ({children}) => {
    return (
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <NavBar />
          <div>
            {children}
          </div>
        </div>
    )
  }

  const ProtectedRoute = ({children}) => {
    const url = useLocation().pathname
    useEffect(() => {
      const scrollToTop = () =>{
        window.scrollTo({
          top: 0, 
          behavior: 'smooth'
        });
      };
      scrollToTop();
    }, [url])
    if(!currentUser){
      return <Navigate to="/login" />
    }
    return children
  }

  const Logged = ({children}) => {
    if(currentUser){
      return <Navigate to="/" />
    }
    return children
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute><Layout/></ProtectedRoute>,
      children: [
        {
          path:"/",
          element: <Home />
        },
        {
          path:"/profile/:id",
          element: <Profile />
        }
        
      ]
    },
    {
      path: "/stories/create",
      element: <HeaderLayout><CreateStory /></HeaderLayout>
    },
    {
      path: "/chat",
      element: <ProtectedRoute><HeaderLayout><Chat /></HeaderLayout></ProtectedRoute>
    },
    {
      path: "/login",
      element: <Logged><Login /></Logged>,
    },
    {
      path: "/register",
      element: <Logged><Register /></Logged>,
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
