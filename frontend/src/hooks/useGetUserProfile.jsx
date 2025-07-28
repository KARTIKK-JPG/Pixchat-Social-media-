
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setSuggestedUsers, setUserProfile } from "@/redux/authSlice"

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch()
    

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/user/${userId}/profile`, { withCredentials: true })
                if (res.data.success) {
                    // console.log(res.data)
                    // console.log("Fetched suggested users:", res.data.user)
                    dispatch(setUserProfile(res.data.user))
                }
            } catch (error) {
                console.log(error)
            }
        }


        fetchUserProfile()
    }, [userId])
}

export default useGetUserProfile
