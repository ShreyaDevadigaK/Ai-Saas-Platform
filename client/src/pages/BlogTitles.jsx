import React from 'react'
import { Sparkles } from 'lucide-react'
import { Hash, Download, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import Markdown from 'react-markdown'
import { useAuth } from '@clerk/clerk-react'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function BlogTitles() {
  const blogCategories = [
    'General', 'Technology', 'Health', 'Lifestyle', 'Travel', 'Food', 'Education', 'Finance', 'Entertainment', 'Sports'
  ]
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);
  const { getToken } = useAuth()

  const handleCopy = () => {
    if(!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  }

  const handleDownload = () => {
    if(!content) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `blog-titles-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("Download started!");
  }


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`;

      const { data } = await axios.post('/api/ai/generate-blog-title',
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    setLoading(false);

  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex gap-4 text-slate-700'>
      {/* left col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold'>AI Title Generator</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Keyword</p>
        <input onChange={(e) => setInput(e.target.value)} value={input}
          type="text"
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='The future of artificial intelligence is...'
          required
        />
        <p className='mt-4 text-sm font-medium'>Category</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {blogCategories.map((item) => (
            <span
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedCategory === item
                ? 'bg-purple-50 text-purple-700'
                : 'text-gray-500 border-gray-300'
                }`}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
        <br />
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
              : <Hash className='w-5' />
          }
          Generate Title
        </button>

      </form>
      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Hash className='w-5 h-5 text-[#8E37EB]' />
            <h1 className='text-xl font-semibold'>Generated titles</h1>
          </div>
          {content && (
            <div className='flex items-center gap-2'>
              <button 
                onClick={handleCopy} 
                className={`p-2 rounded-lg transition-all border border-transparent ${copied ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'hover:bg-slate-50 text-slate-500 hover:border-slate-100'}`} 
                title='Copy to Clipboard'
              >
                {copied ? <Check className='w-5' /> : <Copy className='w-5' />}
              </button>
              <button onClick={handleDownload} className='p-2 hover:bg-slate-50 text-slate-500 rounded-lg transition-colors border border-transparent hover:border-slate-100' title='Download'>
                <Download className='w-5' />
              </button>
            </div>
          )}
        </div>

        {
          !content ? (

            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Hash className='w-9 h-9' />
                <p>Enter a topic and click “Generate title” to get started</p>
              </div>
            </div>

          ) : (

            <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
              <div className='reset-tw'>
                <Markdown>{content}</Markdown>

              </div>
            </div>
          )
        }



      </div>

    </div>
  )
}

export default BlogTitles
