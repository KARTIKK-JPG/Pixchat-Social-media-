// LeftSidebar.jsx

import { setAuthUser } from '@/redux/authSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import axios from 'axios'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { clearLikeNotifications } from '@/redux/rtnSlice'

const LeftSidebar = () => {
    const navigate = useNavigate()
    const { user } = useSelector(store => store.auth)
    const { likeNotification } = useSelector(store => store.realTimeNotification)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [isPopoverOpen, setIsPopoverOpen] = useState(false) // State to control Popover

    const logoutHandler = async () => {
        try {
            const res = await axios.get('https://pixchat-social-media.onrender.com/api/v1/user/logout', { withCredentials: true })
            if (res.data.success) {
                dispatch(setAuthUser(null))
                dispatch(setSelectedPost(null))
                dispatch(setPosts([]))
                navigate("/login")
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler()
        } else if (textType === 'Create') {
            setOpen(true)
        } else if (textType === 'Profile') {
            navigate(`/profile/${user?._id}`)
        } else if (textType === 'Home') {
            navigate("/")
        } else if (textType == 'Messages') {
            navigate("/chat")
        }
        // No direct dispatch for 'Notifications' here
    }

    const handlePopoverOpenChange = (openState) => {
        setIsPopoverOpen(openState); // Update local state for controlled Popover

        // CRITICAL CHANGE: Dispatch clear notifications ONLY when the popover is CLOSING
        // AND there were notifications to begin with.
        if (!openState && likeNotification.length > 0) {
            dispatch(clearLikeNotifications());
        }
    };

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Heart />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" className="w-8 h-8 rounded-full object-cover" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" }
    ]

    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
                <h1 className='my-8 pl-3 font-bold text-2xl font-serif'>PixChat</h1>
                <div>
                    {
                        sidebarItems.map((item, index) => {
                            return (
                                <div
                                    onClick={() => item.text !== 'Notifications' && sidebarHandler(item.text)}
                                    key={index}
                                    className='flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'
                                >
                                    {item.icon}
                                    <span>{item.text}</span>
                                    {item.text === "Notifications" && (
                                        // The Popover itself is now controlled by isPopoverOpen state
                                        <Popover onOpenChange={handlePopoverOpenChange} open={isPopoverOpen}>
                                            <PopoverTrigger asChild>
                                                {/* This div is the clickable area for the popover trigger */}
                                                <div className="absolute inset-0 flex items-center justify-start pl-3 cursor-pointer">
                                                    {/* The red counter badge is only rendered if there are notifications */}
                                                    {likeNotification.length > 0 && (
                                                        <Button
                                                            size='icon'
                                                            className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                                                            // Optional: Prevent click from bubbling if needed, but for asChild, it's usually handled by Radix
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {likeNotification.length}
                                                        </Button>
                                                    )}
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <div>
                                                    {
                                                        // Display notifications if available
                                                        likeNotification.length === 0 ? (
                                                            <p>No new notifications</p>
                                                        ) : (
                                                            likeNotification.map((notification, notifIndex) => (
                                                                <div key={notification.userId || notifIndex} className='flex items-center gap-3 my-2'>
                                                                    <Avatar className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium'>
                                                                        <AvatarImage src={notification.userDetails?.profilePicture} className="w-full h-full object-cover rounded-full" />
                                                                        <AvatarFallback className="w-full h-full rounded-full flex items-center justify-center">
                                                                            {notification.userDetails?.username?.[0]?.toUpperCase() || "U"}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                </div>
                                                            ))
                                                        )
                                                    }
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                </div>
                            )
                        }
                        )}
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    )
}

export default LeftSidebar