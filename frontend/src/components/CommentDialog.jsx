import store from '@/redux/store'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Dialog, DialogOverlay, DialogContent, DialogTrigger } from '@radix-ui/react-dialog'
import { MoreHorizontal } from 'lucide-react'
import Comment from './Comment'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts, setSelectedPost } from '@/redux/postSlice'

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("")
  const { selectedPost, posts } = useSelector(store => store.post)
  const dispatch = useDispatch()

  const changeEventHandler = (e) => {
    const inputText = e.target.value
    setText(inputText.trim() ? inputText : "")
  }

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const newComment = res.data.comment;
        const updatedComments = [...selectedPost.comment, newComment];

        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comment: updatedComments } : p
        );

        dispatch(setPosts(updatedPostData));
        dispatch(setSelectedPost({ ...selectedPost, comment: updatedComments }));

        toast.success("Comment added successfully");
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add comment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="fixed inset-0 bg-black/40" />

      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-0 shadow-lg flex flex-col items-center gap-4 focus:outline-none w-[800px] h-[600px]"
      >
        <div className='flex flex-1 w-full'>
          <div className='w-1/2'>
            <img
              src={selectedPost?.image}
              alt="post_img"
              className='w-full h-full object-cover rounded-l-lg'
            />
          </div>

          <div className='w-1/2 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex gap-3 items-center'>
                <Link to="#">
                  <Avatar className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                    <AvatarImage src={selectedPost?.author?.profilePicture} className="w-full h-full object-cover rounded-full" />
                    <AvatarFallback className="w-full h-full rounded-full flex items-center justify-center">
                      {selectedPost?.author?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link to="#" className='font-semibold text-xs'>
                    {selectedPost?.author?.username}
                  </Link>
                </div>
              </div>

              <Dialog modal>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer' size={18} />
                </DialogTrigger>
                <DialogOverlay className="fixed inset-0 bg-black/40" />
                <DialogContent
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-lg flex flex-col gap-2 focus:outline-none p-6 min-w-[250px]"
                >
                  <div className='cursor-pointer w-full text-[#E04956] font-bold text-center'>
                    Unfollow
                  </div>
                  <div className='cursor-pointer w-full text-center whitespace-nowrap'>
                    Add to favorites
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <hr />

            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
              {
                selectedPost?.comment.map(comment => (
                  <Comment key={comment._id} comment={comment} />
                ))
              }
            </div>

            <div className='p-4'>
              <div className='flex items-center gap-2'>
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder='Add a comment...'
                  className='w-full outline-none border border-gray-300 p-2 rounded text-sm'
                />
                <button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog
