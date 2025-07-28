import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
    const { posts } = useSelector(store => store.post)

    if (!posts || posts.length === 0) {
        return <p className="text-center text-gray-500 mt-4">No posts available</p>
    }

    return (
        <div>
            {posts
                .filter(post => post && post._id) // filter out null or invalid posts
                .map(post => <Post key={post._id} post={post} />)}
        </div>
    )
}

export default Posts
