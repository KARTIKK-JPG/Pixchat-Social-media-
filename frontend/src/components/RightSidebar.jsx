import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth)

  // ✅ Prevent rendering until user is loaded
  if (!user) return null; // or you could return a loader/skeleton instead

  return (
    <div className='w-fit my-10 pr-16'>
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user._id}`}>
          <Avatar className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
            <AvatarImage src={user?.profilePicture} alt="post_image" className="w-full h-full object-cover rounded-full" />
            <AvatarFallback className="w-full h-full rounded-full flex items-center justify-center">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className='font-semibold text-sm'>
            <Link to={`/profile/${user._id}`}>{user?.username}</Link>
          </h1>
          <span className='text-gray-600 text-sm'>
            {user?.bio ? `${user.bio.slice(0, 40)}...` : 'Bio here...'}
          </span>
        </div>
      </div>

      <SuggestedUsers />
    </div>
  )
}

export default RightSidebar
