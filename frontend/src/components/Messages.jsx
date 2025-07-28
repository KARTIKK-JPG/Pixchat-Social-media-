import React from 'react'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'

const Messages = ({ selectedUser }) => {
    useGetRTM()
    useGetAllMessage()
    const { messages } = useSelector(store => store.chat)
    const {user} = useSelector(store=>store.auth)

    return (
        <div className='overflow-y-auto flex-1 p-4'>
            <div className='flex justify-center'>
                <div className='flex flex-col items-center justify-center'>
                    <Avatar className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                        <AvatarImage src={selectedUser?.profilePicture} alt="post_image" className="w-full h-full object-cover rounded-full" />
                        <AvatarFallback className="w-full h-full rounded-full flex items-center justify-center">
                            {selectedUser?.username?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <span>{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}> <Button className="h-8 my-2" variant="secondary">View Profile</Button></Link>
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                {
                    messages && messages.map((msg) => {
                        return (
                            <div className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                    {msg.message}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Messages