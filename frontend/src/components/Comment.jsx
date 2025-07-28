import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'

const Comment = ({ comment }) => {
    return (
        <div className='my-2'>
            <div className='flex gap-3 items-center'>
                <Avatar className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                    <AvatarImage src={comment?.author?.profilePicture} className="w-full h-full object-cover rounded-full"/>
                    <AvatarFallback className="w-full h-full rounded-full flex items-center justify-center">
                        {comment?.author?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>

                <h1 className='font-bold text-sm'>
                    {comment?.author?.username}
                    <span className='font-normal pl-1'>{comment?.text}</span>
                </h1>
            </div>
        </div>
    )
}

export default Comment
