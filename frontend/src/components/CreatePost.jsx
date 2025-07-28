import { Dialog, DialogOverlay, DialogContent } from '@radix-ui/react-dialog'
import React, { useRef, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { readFileDataURL } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/redux/postSlice'

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef()
  const [file, setFile] = useState("")
  const [caption, setCaption] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useSelector(store => store.auth)
  const { posts } = useSelector(store => store.post)
  const dispatch = useDispatch()

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      const dataUrl = await readFileDataURL(file)
      setImagePreview(dataUrl)

    }
  }

  const createPostHandler = async (e) => {
    const formData = new FormData()
    formData.append("caption", caption)
    if (imagePreview) formData.append("image", file)
    try {
      setLoading(true)
      const res = await axios.post('http://localhost:8000/api/v1/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]))
        toast.success(res.data.message)
        setOpen(false)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogOverlay className="fixed inset-0 bg-black/50" />

      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="
          fixed top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          w-full max-w-lg
          bg-white rounded-lg
          shadow-lg p-6 outline-none
        "
      >

        <div >
          <h2 className="text-xl font-bold mb-4">Create New Post</h2>
          <div className='flex gap-3 items-center'>
            <Avatar className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
              <AvatarImage src={user?.profilePicture} alt="img" className="w-full h-full object-cover rounded-full" />
              <AvatarFallback className="w-full h-full rounded-full flex items-center justify-center">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className='font-semibold text-xs'>{user?.username}</h1>
              <span className='text-gray-600 text-xs'>Bio here...</span>
            </div>
          </div>
        </div>
        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="Write a caption..." />
        {
          imagePreview && (
            <div className='w-full h-64 flex items-center justify-center'>
              <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
            </div>
          )
        }
        <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
        <Button onClick={() => imageRef.current.click()} className="w-fit mx-36 bg-[#0095F6] hover:bg-[#258bcf] mt-4">Select from computer</Button>
        {
          imagePreview && (
            loading ? (
              <Button className="w-full mt-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </Button>
            ) : (
              <Button onClick={createPostHandler} type="submit" className="w-full mt-4">
                Post
              </Button>
            )
          )
        }
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost
