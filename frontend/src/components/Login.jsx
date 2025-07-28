import React, { useEffect, useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
        setInput({ email: "", password: "" });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [])

  return (
    <div className='flex items-center w-screen h-screen justify-center py-24'>
      <form
        onSubmit={signupHandler}
        className='shadow-lg flex flex-col gap-5 p-8 w-full max-w-md'
      >
        <div className='my-4'>
          <h1 className='text-center font-bold text-xl'>PixChat</h1>
          <p className='text-sm text-center'>
            Start sharing your moments. Login...
          </p>
        </div>

        <div>
          <Label htmlFor="email" className="font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            autoComplete="email"
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <Label htmlFor="password" className="font-medium">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            autoComplete="new-password"
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </>
            ) : (
              "Login"
            )}
          </Button>

          <div className='mt-4 text-center text-sm'>
            Don't have an account? <Link to="/signup" className='text-blue-600 font-medium'>Signup</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
