import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from '@radix-ui/react-dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import React, { useState } from 'react'
import { FaHeart, FaRegHeart } from "react-icons/fa"
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import axios from 'axios'
import { Badge } from './ui/badge'

const Post = ({ post }) => {
  const [text, setText] = useState("")
  const [open, setOpen] = useState(false)
  const { user } = useSelector(store => store.auth)
  const { posts } = useSelector(store => store.post)

  if (!post || !post.author || !user) return null

  const [liked, setLiked] = useState(post.likes.includes(user._id))
  const [postLike, setPostLike] = useState(post.likes.length)

  const dispatch = useDispatch()

  const changeEventHandler = (e) => {
    const inputText = e.target.value
    setText(inputText.trim() ? inputText : "")
  }

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like'
      const res = await axios.get(`https://pixchat-social-media.onrender.com/api/v1/post/${post._id}/${action}`, { withCredentials: true })
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1
        setPostLike(updatedLikes)
        setLiked(!liked)

        const updatedPostData = posts.map(p =>
          p._id === post._id
            ? { ...p, likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id] }
            : p
        )

        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://pixchat-social-media.onrender.com/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )

      if (res.data.success) {
        const newComment = res.data.comment
        const updatedComments = [...post.comment, newComment]

        const updatedPostData = posts.map(p =>
          p._id === post._id ? { ...p, comment: updatedComments } : p
        )

        dispatch(setPosts(updatedPostData))
        toast.success("Comment added successfully")
        setText("")
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to add comment")
    }
  }

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`https://pixchat-social-media.onrender.com/api/v1/post/delete/${post._id}`, { withCredentials: true })
      if (res.data.success) {
        const updatedPostData = posts.filter((postItem) => postItem._id !== post._id)
        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`https://pixchat-social-media.onrender.com/api/v1/post/${post?._id}/bookmark`, { withCredentials: true })
      if (res.data.success) {
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="my-8 w-full max-w-sm ml-20">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
            <AvatarImage src={post.author.profilePicture} alt="post_image" className="w-full h-full object-cover rounded-full" />
            <AvatarFallback className="w-full h-full rounded-full flex items-center justify-center">
              {post.author.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className='flex items-center gap-3'>
            <h1>{post.author.username}</h1>
            {user._id === post.author._id && <Badge variant="secondary">Author</Badge>}
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>

          <DialogOverlay className="fixed inset-0 bg-black/40" />
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-8 px-32 shadow-lg flex flex-col items-center gap-4 focus:outline-none">
          {
            post?.author._id !== user?._id && <button className="text-[#E04956] font-semibold focus:outline-none">
              Unfollow
            </button>
          }
            
            <button className="text-black font-normal focus:outline-none">
              Add to favorites
            </button>
            {user._id === post.author._id && (
              <button onClick={deletePostHandler} className="text-black font-normal focus:outline-none">
                Delete
              </button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <img className='rounded-sm my-2 w-full aspect-square object-cover' src={post.image} alt="post_img" />

      <div className='flex items-center justify-between my-2'>
        <div className='flex items-center gap-3'>
          {liked
            ? <FaHeart onClick={likeOrDislikeHandler} size={24} className='cursor-pointer text-red-600' />
            : <FaRegHeart onClick={likeOrDislikeHandler} size={22} className='cursor-pointer hover:text-gray-600' />}
          <MessageCircle onClick={() => {
            dispatch(setSelectedPost(post))
            setOpen(true)
          }} className='cursor-pointer hover:text-gray-600' />
          <Send className='cursor-pointer hover:text-gray-600' />
        </div>
        <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' />
      </div>

      <span className='font-sm block mb-2'>{postLike} likes </span>
      <p className='font-sm mr-2'>
        <span className="mr-2 font-semibold">{post.author.username}</span>
        {post.caption}
      </p>

      {post.comment?.length > 0 && (
        <span
          className='text-sm mr-2 cursor-pointer text-gray-400'
          onClick={() => {
            dispatch(setSelectedPost(post))
            setOpen(true)
          }}
        >
          View all {post.comment.length} comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />

      <div className='flex items-center justify-between'>
        <input
          type='text'
          placeholder='Add a comment...'
          value={text}
          onChange={changeEventHandler}
          className='outline-none text-sm w-full'
        />
        {text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span>}
      </div>
    </div>
  )
}

export default Post
