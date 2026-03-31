import React from 'react'

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-md ${className}`}></div>
  )
}

export const DashboardSkeleton = () => {
  return (
    <div className='space-y-4 max-w-5xl'>
      <div className='flex items-center justify-between mb-4'>
        <Skeleton className='h-6 w-32' />
        <Skeleton className='h-4 w-16' />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className='p-4 border border-slate-100 rounded-2xl flex items-center gap-4'>
           <Skeleton className='w-10 h-10 rounded-xl' />
           <div className='flex-1 space-y-2'>
             <Skeleton className='h-4 w-3/4' />
             <Skeleton className='h-3 w-1/4' />
           </div>
           <Skeleton className='w-8 h-8 rounded-lg' />
        </div>
      ))}
    </div>
  )
}

export const CommunitySkeleton = () => {
  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6'>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <Skeleton key={i} className='h-[320px] rounded-2xl' />
      ))}
    </div>
  )
}

export default Skeleton
