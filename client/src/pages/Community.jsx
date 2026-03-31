import { useAuth, useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Heart, FileText, Type, Image as ImageIcon, Briefcase, Share2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { CommunitySkeleton } from '../components/Skeleton'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const Community = () => {
  const [creations, setCreations] = useState([])
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()
  const [visibleCount, setVisibleCount] = useState(12);
  const itemsPerLoad = 12;

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get('/api/user/get-published-creations', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post('/api/user/toggle-like-creations', { id }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      if (data.success) {
        toast.success(data.message)
        await fetchCreations()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCreations()
    }
  }, [user])

  const getIcon = (type) => {
    const icons = {
      'article': FileText,
      'blog-title': Type,
      'image': ImageIcon,
      'resume-review': Briefcase
    };
    return icons[type] || FileText;
  }

  return (
    <div className='flex-1 h-full overflow-y-scroll bg-slate-50/30 p-4 sm:p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-2xl font-bold text-slate-800'>Community Gallery</h1>
            <p className='text-slate-500 text-sm mt-1'>Explore what others are creating with our AI tools.</p>
          </div>
          <div className='bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-2'>
            <Share2 className='w-4 text-indigo-500' />
            <span className='text-xs font-bold text-slate-600 uppercase tracking-tighter'>Published Works</span>
          </div>
        </div>

        {loading ? (
          <CommunitySkeleton />
        ) : creations.length > 0 ? (
          <>
            <div className='grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6'>
              {creations.slice(0, visibleCount).map((creation) => {
                const Icon = getIcon(creation.type);
                return (
                  <div key={creation.id} className='group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-[320px]'>
                    {/* ... (rest of card content) */}
                    <div className='relative flex-1 bg-slate-50 overflow-hidden'>
                      {creation.type === 'image' ? (
                        <img src={creation.content} alt={creation.prompt} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' />
                      ) : (
                        <div className='p-4 h-full flex flex-col'>
                          <div className={`w-8 h-8 rounded-lg mb-3 flex items-center justify-center ${
                            creation.type === 'article' ? 'bg-blue-50 text-blue-500' : 'bg-rose-50 text-rose-500'
                          }`}>
                            <Icon className='w-4' />
                          </div>
                          <p className='text-slate-700 text-[13px] leading-relaxed overflow-hidden line-clamp-[6]'>
                            {creation.content}
                          </p>
                        </div>
                      )}
                      
                      {/* Overlay on hover */}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5'>
                         <p className='text-white text-sm font-medium line-clamp-2 mb-1'>{creation.prompt}</p>
                         <p className='text-white/60 text-[10px] uppercase tracking-widest font-bold'>{creation.type?.replace('-', ' ')}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className='p-4 border-t border-slate-50 flex items-center justify-between bg-white'>
                        <div className='flex items-center gap-2'>
                          <div className='w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500'>
                            {creation.userId?.slice(-2).toUpperCase() || 'AI'}
                          </div>
                          <span className='text-xs text-slate-500 font-medium'>u/{creation.userId?.slice(-6) || 'anonymous'}</span>
                        </div>
                        
                        <button 
                          onClick={() => imageLikeToggle(creation.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                            creation.likes?.includes(user?.id) 
                            ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                            : 'bg-slate-50 text-slate-500 border border-transparent hover:border-slate-200'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${creation.likes?.includes(user?.id) ? 'fill-rose-600' : ''}`} />
                          <span className='text-xs font-bold'>{creation.likes?.length || 0}</span>
                        </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {creations.length > visibleCount && (
              <div className='flex justify-center mt-12 pb-12'>
                <button 
                  onClick={() => setVisibleCount(prev => prev + itemsPerLoad)}
                  className='px-8 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold text-sm hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm'
                >
                  Load More Creations
                </button>
              </div>
            )}
          </>
        ) : (
          <div className='text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100'>
             <div className='w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4'>
               <ImageIcon className='w-8 text-slate-300' />
             </div>
             <h3 className='text-lg font-bold text-slate-800'>No published creations found</h3>
             <p className='text-slate-500 text-sm'>Be the first to share something with the community!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Community
