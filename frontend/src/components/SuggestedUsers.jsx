import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector(store => store.auth)

  return (
    <div className='my-10'>
      <div className='flex items-center justify-between text-sm my-6'>
        <h1 className='font-semibold text-gray-600 mr-[40px]'>Suggested for you</h1>
        <span className='font-medium cursor-pointer'>See All</span>
      </div>

      {(suggestedUsers || []).map((user) => (
        <div key={user._id} className='flex items-center justify-between my-5'>
          <div className="flex items-center gap-2">
            <Link to={`/profile/${user._id}`}>
              <Avatar className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                <AvatarImage src={user?.profilePicture} alt="user_image" className="w-full h-full object-cover rounded-full" />
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
          <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>Follow</span>
        </div>
      ))}
    </div>
  )
}

export default SuggestedUsers
