import { Eraser, Download, Sparkles } from 'lucide-react';
import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

function RemoveBackground() {

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(null);

  const { getToken } = useAuth()

  const handleDownload = async () => {
    if(!content) return;
    try {
      const response = await fetch(content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `no-bg-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download started!");
    } catch (error) {
      toast.error("Download failed");
    }
  }


  const onSubmitHandler = async (e) => {
    e.preventDefault();


    try {

      setLoading(true);
      const formData = new FormData()
      formData.append('image', input)

      const { data } = await axios.post('/api/ai/remove-image-background', formData
        , {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        });

      if (data.success) {
        setContent(data.content);
      }
      else {
        toast.error(data.message)
      }


    }
    catch (error) {
      toast.error(error.message)

    }
    setLoading(false);


  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex  gap-4 text-slate-700'>
      {/* left col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#FF4938]' />
          <h1 className='text-xl font-semibold'>Background Removal</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Upload Image</p>

        <input onChange={(e) => {
          const file = e.target.files[0];
          setInput(file);
          if (file) {
            setPreview(URL.createObjectURL(file));
          }
        }}
          type="file" accept='image/*'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
          required
        />

        {preview && (
          <div className='mt-4 p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-1'>
            <img src={preview} className='w-12 h-12 object-cover rounded-lg shadow-sm' alt="Preview" />
            <div className='flex-1 min-w-0'>
              <p className='text-xs font-bold text-slate-700 truncate'>{input?.name}</p>
              <p className='text-[10px] text-slate-400 uppercase tracking-tighter'>Selected Image</p>
            </div>
          </div>
        )}

        <p className='text-xs text-gray-500 font-light mt-1'>Supports JPG, PNG, and GIF and other image formats. </p>


        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
              : <Eraser className='w-5' />
          }

          Remove Background
        </button>

      </form>
      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Eraser className='w-5 h-5 text-[#FF4938]' />
            <h1 className='text-xl font-semibold'>Processed Image</h1>
          </div>
          {content && (
            <button onClick={handleDownload} className='p-2 hover:bg-slate-50 text-slate-500 rounded-lg transition-colors border border-transparent hover:border-slate-100' title='Download'>
              <Download className='w-5' />
            </button>
          )}
        </div>

        {
          !content ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Eraser className='w-9 h-9' />
                <p>Upload an image and click "Remove Background" to get started</p>
              </div>
            </div>
          ) : (
            <img src={content} alt="image" className='mt-3 w-full h-full' />
          )
        }


      </div>

    </div>
  )
}

export default RemoveBackground
