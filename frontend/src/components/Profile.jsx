import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import useGetUserProfile from '@/hooks/useGetUserProfile';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');

  const { userProfile, user } = useSelector(store => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === 'posts'
      ? userProfile?.posts || []
      : userProfile?.bookmarks || [];

  return (
    <div className='max-w-5xl mx-auto px-24 w-full'>


      <div className='grid grid-cols-1 md:grid-cols-[auto,1fr] gap-10 w-full py-8 px-12'>

        <section className='flex items-start justify-center'>
          <Avatar className='h-32 w-32 rounded-full overflow-hidden border border-gray-300'>
            <AvatarImage
              src={userProfile?.profilePicture}
              alt='profilephoto'
              className='h-full w-full object-cover'
            />
            <AvatarFallback className='flex items-center justify-center h-full w-full bg-gray-200 text-gray-700 text-2xl font-semibold'>
              {userProfile?.username?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </section>


        <section>
          <div className='flex flex-col gap-5'>
            <div className='flex items-center gap-4 flex-wrap'>
              <span className='text-xl font-semibold'>
                {userProfile?.username}
              </span>
              {isLoggedInUserProfile ? (
                <>
                  <Link to="/account/edit">
                    <Button variant='secondary' className='h-8'>
                      Edit profile
                    </Button>
                  </Link>

                  <Button variant='secondary' className='h-8'>
                    View archive
                  </Button>
                  <Button variant='secondary' className='h-8'>
                    Ad tools
                  </Button>
                </>
              ) : isFollowing ? (
                <>
                  <Button variant='secondary' className='h-8'>
                    Unfollow
                  </Button>
                  <Button variant='secondary' className='h-8'>
                    Message
                  </Button>
                </>
              ) : (
                <Button className='bg-[#0095F6] hover:bg-[#3192d2] h-8'>
                  Follow
                </Button>
              )}
            </div>

            <div className='flex items-center gap-6'>
              <p>
                <span className='font-semibold'>
                  {userProfile?.posts?.length || 0}{' '}
                </span>
                posts
              </p>
              <p>
                <span className='font-semibold'>
                  {userProfile?.followers?.length || 0}{' '}
                </span>
                followers
              </p>
              <p>
                <span className='font-semibold'>
                  {userProfile?.following?.length || 0}{' '}
                </span>
                following
              </p>
            </div>

            <div className='flex flex-col gap-1'>
              <span className='font-semibold'>
                {userProfile?.bio || 'bio here... '}
              </span>
              <Badge className='w-fit' variant='secondary'>
                <AtSign />{' '}
                <span className='pl-1'>{userProfile?.username}</span>
              </Badge>
              {/* <span>Tips for makeup and styling</span>
              <span>Master in wedding makeups</span>
              <span>DM for booking</span> */}
            </div>
          </div>
        </section>
      </div>


      <div className='w-full border-t border-t-gray-200'>
        <div className='flex items-center justify-center gap-10 text-sm mt-4'>
          <span
            className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''
              }`}
            onClick={() => handleTabChange('posts')}
          >
            POSTS
          </span>
          <span
            className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''
              }`}
            onClick={() => handleTabChange('saved')}
          >
            SAVED
          </span>
          <span className='py-3 cursor-pointer'>REELS</span>
          <span className='py-3 cursor-pointer'>TAGS</span>
        </div>


        <div className='grid grid-cols-3 gap-1 mt-4'>
          {[...displayedPost].reverse().map((post) => (
            <div key={post?._id} className='relative group cursor-pointer'>
              <img
                src={post.image}
                alt='postimage'
                className='rounded-sm my-2 w-full aspect-square object-cover'
              />
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <div className='flex items-center text-white space-x-4'>
                  <button className='flex items-center gap-2 hover:text-gray-300'>
                    <Heart />
                    <span>{post?.likes?.length || 0}</span>
                  </button>
                  <button className='flex items-center gap-2 hover:text-gray-300'>
                    <MessageCircle />
                    <span>{post?.comment?.length || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Profile;
