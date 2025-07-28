import { setSelectedUser } from '@/redux/authSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { MessageCircleCode } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import Messages from './Messages'

import axios from 'axios'
import { setMessages } from '@/redux/chatSlice.js'

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("")
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth)
    const { onlineUsers = [], messages = [] } = useSelector(store => store.chat || {})
    const dispatch = useDispatch()

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`https://pixchat-social-media.onrender.com/api/v1/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            if (res.data.success) {
                dispatch(setMessages([...(messages || []), res.data.newMessage]))

                setTextMessage("")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null))
        }
    }, [])

    return (
        <div className='flex ml-[16%] h-screen'>
            {/* Sidebar */}
            <aside className='w-[25%] border-r border-gray-300 p-4 overflow-y-auto'>
                {/* Current User */}
                <div className="flex items-center gap-2 mb-4">
                    <Avatar className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                        <AvatarImage src={user?.profilePicture} alt="post_image" className="w-full h-full object-cover rounded-full" />
                        <AvatarFallback className="w-full h-full rounded-full flex items-center justify-center">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <h1 className='font-bold text-xl'>{user?.username}</h1>
                </div>

                <hr className='mb-4 border-gray-300' />

                {/* Suggested Users */}
                {
                    suggestedUsers.map((suggestedUser) => {
                        const isOnline = onlineUsers.includes(suggestedUser?._id)
                        return (
                            <div
                                key={suggestedUser._id}
                                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                                className='flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer rounded-md'
                            >
                                <Avatar className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                                    <AvatarImage
                                        src={suggestedUser?.profilePicture}
                                        alt="user"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                    <AvatarFallback>
                                        {suggestedUser?.username?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col'>
                                    <span className='font-medium'>{suggestedUser?.username}</span>
                                    <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                                        {isOnline ? 'online' : 'offline'}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                }
            </aside>

            {/* Chat Main */}
            <main className='flex-1 flex flex-col h-full'>
                {
                    selectedUser ? (
                        <>
                            {/* Header */}
                            <div className='flex gap-3 items-center px-4 py-3 border-b border-gray-300'>
                                <Avatar className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                                    <AvatarImage src={selectedUser?.profilePicture} alt="post_image" className="w-full h-full object-cover rounded-full" />
                                    <AvatarFallback className="w-full h-full rounded-full flex items-center justify-center">
                                        {selectedUser?.username?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className='font-semibold'>{selectedUser?.username}</h2>
                                    <p className={`text-xs font-bold ${onlineUsers.includes(selectedUser?._id) ? 'text-green-600' : 'text-red-600'}`}>
                                        {onlineUsers.includes(selectedUser?._id) ? 'online' : 'offline'}
                                    </p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className='flex-1 p-4 overflow-y-auto'>
                                <Messages selectedUser={selectedUser} />
                            </div>

                            {/* Input */}
                            <div className='flex items-center p-4 border-t border-gray-300'>
                                <input
                                    type="text"
                                    className="flex-1 mr-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Type a message..."
                                    value={textMessage}
                                    onChange={(e) => setTextMessage(e.target.value)}
                                />
                                <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
                            </div>
                        </>
                    ) : (
                        <div className='flex flex-col items-center justify-center flex-1'>
                            <MessageCircleCode className='w-32 h-32 text-gray-400 mb-4' />
                            <h1 className='font-medium text-xl'>Your messages</h1>
                            <span className='text-gray-500'>Send a message to start a chat</span>
                        </div>
                    )
                }
            </main>
        </div>
    )
}

export default ChatPage
