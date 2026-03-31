import React, { useEffect } from 'react'
import { dummyCreationData } from '../assets/assets'
import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Gem } from 'lucide-react'
import { Protect, useAuth, useUser } from '@clerk/clerk-react';
import CreationItem from '../components/CreationItem'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FileText, Type, Image as ImageIcon, Briefcase, Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DashboardSkeleton } from '../components/Skeleton'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

function Dashboard() {

  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()
  const [userState, setUserState] = useState(null)
  const { user } = useUser()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/user/get-user-creations'
        , {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        });

      if (data.success) {
        setCreations(data.creations);
      }
      else {
        toast.error(data.message)
      }
    }
    catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const deleteCreation = (id) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-in fade-in zoom-in duration-300' : 'animate-out fade-out zoom-out duration-300'
        } max-w-sm w-full bg-white shadow-2xl rounded-3xl pointer-events-auto flex flex-col p-6 border border-slate-100`}
      >
        <div className="flex items-center gap-4 mb-6">
           <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
             <Trash2 className="w-6" />
           </div>
           <div>
             <h3 className="text-lg font-bold text-slate-800">Delete Creation?</h3>
             <p className="text-sm text-slate-500">This action cannot be undone.</p>
           </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await performDelete(id);
            }}
            className="flex-1 bg-rose-600 text-white py-3 rounded-2xl text-sm font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: 'top-center' });
  }

  const performDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/api/user/delete-creation/${id}`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      if (data.success) {
        toast.success(data.message);
        setCreations(prev => prev.filter(item => item.id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getDashboardData()
  }, [])


  return (
    <div className='h-full overflow-y-scroll p-4 sm:p-8 bg-slate-50/50'>
      
      {/* Welcome Header */}
      <div className='mb-8'>
        <h1 className='text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight'>
          Hello, {user?.firstName || 'User'}! 👋
        </h1>
        <p className='text-slate-500 mt-1'>Here's an overview of your AI-powered workspace.</p>
      </div>

      <div className='flex justify-start gap-4 flex-wrap mb-10'>
        {/* Total Creations Card */}
        <div className='flex justify-between items-center w-full sm:w-72 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow'>
          <div className='text-slate-600'>
            <p className='text-xs font-medium uppercase tracking-wider text-slate-400'>Total Creations</p>
            <h2 className='text-2xl font-bold mt-1 text-slate-800'>{creations.length}</h2>
          </div>
          <div className='w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex justify-center items-center'>
            <Sparkles className='w-6' />
          </div>
        </div>

        {/* Active Plan Card */}
        <div className='flex justify-between items-center w-full sm:w-72 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow'>
          <div className='text-slate-600'>
            <p className='text-xs font-medium uppercase tracking-wider text-slate-400'>Active Plan</p>
            <h2 className='text-2xl font-bold mt-1 text-slate-800'>
              <Protect plan='premium' fallback='Free Tier'>Premium</Protect>
            </h2>
          </div>
          <div className='w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex justify-center items-center'>
            <Gem className='w-6' />
          </div>
        </div>

        {/* Usage Card (Only for Free) */}
        <Protect plan='premium' fallback={
          <div className='flex justify-between items-center w-full sm:w-72 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow'>
            <div className='text-slate-600 w-full'>
              <p className='text-xs font-medium uppercase tracking-wider text-slate-400'>Credits Used</p>
              <div className='flex items-center justify-between mt-1 mb-2'>
                <h2 className='text-2xl font-bold text-slate-800'>{user?.privateMetadata?.free_usage || 0}/10</h2>
                <span className='text-[10px] text-slate-400'>Free Credits</span>
              </div>
              <div className='w-full bg-slate-100 h-1.5 rounded-full overflow-hidden'>
                <div 
                  className='bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500' 
                  style={{ width: `${((user?.privateMetadata?.free_usage || 0) / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        } />
      </div>

      {/* Start Creating Section */}
      <div className='mb-10'>
        <div className='flex items-center gap-2 mb-4'>
          <Plus className='w-5 text-indigo-500' />
          <h2 className='text-lg font-semibold text-slate-800'>Start Creating</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
           {[
             { title: 'Write Article', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50', path: '/ai/write-article' },
             { title: 'Blog Titles', icon: Type, color: 'text-rose-500', bg: 'bg-rose-50', path: '/ai/blog-titles' },
             { title: 'AI Images', icon: ImageIcon, color: 'text-emerald-500', bg: 'bg-emerald-50', path: '/ai/generate-images' },
             { title: 'Resume Review', icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-50', path: '/ai/review-resume' },
           ].map((tool, idx) => (
             <div 
               key={idx} 
               onClick={() => navigate(tool.path)}
               className='group p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all'
             >
               <div className={`w-12 h-12 rounded-xl ${tool.bg} ${tool.color} flex justify-center items-center group-hover:scale-110 transition-transform`}>
                 <tool.icon className='w-6' />
               </div>
               <span className='font-medium text-slate-700'>{tool.title}</span>
             </div>
           ))}
        </div>
      </div>

      {
        loading ?
          (
            <div className='max-w-5xl'>
              <DashboardSkeleton />
            </div>
          ) :
          (
            <div className='space-y-4 max-w-5xl mb-12'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Sparkles className='w-5 text-indigo-500' />
                  <h2 className='text-lg font-semibold text-slate-800'>Recent Creations</h2>
                </div>
                <span className='text-xs text-slate-400'>{creations.length} Items</span>
              </div>
              
              {creations.length > 0 ? (
                <>
                  <div className='grid gap-3'>
                    {creations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(((item) => (
                      <CreationItem 
                        key={item.id} 
                        item={item} 
                        onDelete={() => deleteCreation(item.id)} 
                      />
                    )))}
                  </div>

                  {/* Pagination Controls */}
                  {creations.length > itemsPerPage && (
                    <div className='flex items-center justify-center gap-2 mt-8 pb-8'>
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className='px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm'
                      >
                        Previous
                      </button>
                      
                      <div className='flex items-center gap-1 mx-2'>
                        {Array.from({ length: Math.ceil(creations.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                              currentPage === page 
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110' 
                              : 'text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(creations.length / itemsPerPage), prev + 1))}
                        disabled={currentPage === Math.ceil(creations.length / itemsPerPage)}
                        className='px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm'
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className='bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center'>
                   <div className='w-20 h-20 bg-slate-50 rounded-full flex justify-center items-center mb-4'>
                     <Sparkles className='w-10 text-slate-300' />
                   </div>
                   <h3 className='text-xl font-bold text-slate-700'>No creations yet</h3>
                   <p className='text-slate-400 mt-2 max-w-sm'>Start using our AI tools to generate high-quality content and images for your projects.</p>
                   <button 
                     onClick={() => navigate('/ai/write-article')}
                     className='mt-6 bg-slate-900 text-white px-8 py-2.5 rounded-full font-medium hover:bg-black transition-colors'
                   >
                     Get Started
                   </button>
                </div>
              )}
            </div>
          )
      }
    </div>
  )
}

export default Dashboard
