import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from './ui/select'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setAuthUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const EditProfile = () => {
    const imageRef = useRef()
    const { user } = useSelector(store => store.auth)
    const [loading, setLoading] = useState(false)

    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture || '',
        bio: user?.bio || '',
        gender: user?.gender || 'Male' // Default gender to avoid controlled/uncontrolled warning
    })

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            console.log("Selected file:", file)
            setInput({ ...input, profilePhoto: file })
        }
    }

    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value })
    }

    const editProfileHandler = async () => {
        const formData = new FormData()
        formData.append("bio", input.bio)
        formData.append("gender", input.gender)
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto)
        }
        try {
            setLoading(true)
            const res = await axios.post('http://localhost:8000/api/v1/user/profile/edit', formData, {
                headers: {
                    'Content-type': 'multipart/form-data'
                },
                withCredentials: true
            })
            if (res.data.success) {
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user.gender
                }
                dispatch(setAuthUser(updatedUserData))
                navigate(`/profile/${user?._id}`)
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)

        }finally{
            setLoading(false)
        }
    }

    return (
        <div className='flex max-w-2xl mx-auto pl-10'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>

                <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
                    <div className='flex items-center gap-3'>
                        <Avatar className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                            <AvatarImage
                                src={
                                    input.profilePhoto instanceof File
                                        ? URL.createObjectURL(input.profilePhoto)
                                        : user?.profilePicture
                                }
                                alt="profile"
                                className="w-full h-full object-cover rounded-full"
                            />
                            <AvatarFallback className="w-full h-full rounded-full flex items-center justify-center">
                                {user?.username?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-bold text-sm'>{user?.username}</h1>
                            <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
                        </div>
                    </div>
                    <input
                        ref={imageRef}
                        type="file"
                        onChange={fileChangeHandler}
                        className='hidden'
                    />
                    <Button onClick={() => imageRef?.current.click()} className="bg-[#0095F6] h-8 hover:bg-[#318bc7]">
                        Change Photo
                    </Button>
                </div>

                <div>
                    <h1 className='font-bold text-xl mb-2'>Bio</h1>
                    <Textarea
                        value={input.bio}
                        onChange={(e) => setInput({ ...input, bio: e.target.value })}
                        name='bio'
                        className='focus-visible:ring-transparent'
                    />
                </div>

                <div>
                    <h1 className='font-bold mb-2'>Gender</h1>
                    <Select value={input.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Gender</SelectLabel>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className='flex justify-end'>
                    {loading ? (
                        <Button className="w-fit bg-[#0095F6] h-8 hover:bg-[#318bc7] ">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please Wait
                        </Button>
                    ) : (
                        <Button onClick={editProfileHandler} className="w-fit bg-[#0095F6] h-8 hover:bg-[#318bc7] ">
                            Submit
                        </Button>
                    )}
                </div>
            </section>
        </div>
    )
}

export default EditProfile
