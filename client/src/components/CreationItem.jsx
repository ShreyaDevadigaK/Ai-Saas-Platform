import React, { useState } from 'react'
import Markdown from 'react-markdown'
import toast from 'react-hot-toast'
import { FileText, Type, Image as ImageIcon, Briefcase, Trash2, ChevronDown, ChevronUp, Calendar, Download, Copy, Check } from 'lucide-react'

const CreationItem = ({ item, onDelete }) => {

  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Map icons to types
  const Icon = {
    'article': FileText,
    'blog-title': Type,
    'image': ImageIcon,
    'resume-review': Briefcase
  }[item.type] || FileText;

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      if (item.type === 'image') {
        const response = await fetch(item.content);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `creation-${item.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([item.content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${item.type}-${item.id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      toast.success("Download started!");
    } catch (error) {
      toast.error("Download failed");
    }
  }

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  }

  return (
    <div className={`p-4 max-w-5xl text-sm bg-white border border-slate-200 rounded-2xl transition-all duration-300 ${expanded ? 'ring-1 ring-indigo-100 shadow-sm' : 'hover:border-indigo-200 hover:shadow-sm'}`}>
      <div className='flex justify-between items-center gap-4'>
        <div className='flex items-center gap-4 flex-1 cursor-pointer' onClick={() => setExpanded(!expanded)}>
          <div className={`w-10 h-10 rounded-xl flex justify-center items-center shrink-0 ${expanded ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
            <Icon className='w-5' />
          </div>
          <div className='flex-1 min-w-0'>
            <h2 className='font-semibold text-slate-700 truncate'>{item.prompt}</h2>
            <div className='flex items-center gap-3 mt-1'>
               <div className='flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-slate-400'>
                 <Calendar className='w-3' />
                 {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
               </div>
               <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                 item.type === 'article' ? 'bg-blue-50 text-blue-600' :
                 item.type === 'image' ? 'bg-emerald-50 text-emerald-600' :
                 'bg-amber-50 text-amber-600'
               }`}>
                 {item.type.replace('-', ' ')}
               </span>
            </div>
          </div>
        </div>
        
        <div className='flex items-center gap-2'>
          <button 
            onClick={handleDownload}
            className='p-2 hover:bg-blue-50 hover:text-blue-500 rounded-lg text-slate-400 transition-all border border-transparent hover:border-blue-100'
            title="Download"
          >
            <Download className='w-4' />
          </button>
          {item.type !== 'image' && (
            <button 
              onClick={handleCopy}
              className={`p-2 rounded-lg transition-all border border-transparent ${copied ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'hover:bg-slate-50 text-slate-400'}`}
              title="Copy to Clipboard"
            >
              {copied ? <Check className='w-4' /> : <Copy className='w-4' />}
            </button>
          )}
          <button 
            onClick={() => setExpanded(!expanded)}
            className='p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors'
          >
            {expanded ? <ChevronUp className='w-4' /> : <ChevronDown className='w-4' />}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className='p-2 hover:bg-rose-50 hover:text-rose-500 rounded-lg text-slate-400 transition-all border border-transparent hover:border-rose-100'
            title="Delete Creation"
          >
            <Trash2 className='w-4' />
          </button>
        </div>
      </div>

      {
        expanded && (
          <div className='mt-4 pt-4 border-t border-slate-50 animate-in fade-in slide-in-from-top-2 duration-300'>
            {item.type === 'image' ? (
              <div className='bg-slate-50 rounded-xl p-2 inline-block'>
                <img src={item.content} alt="AI Generated" className='rounded-lg max-w-full sm:max-w-md shadow-sm' />
              </div>
            ) : (
              <div className='bg-slate-50 rounded-xl p-5 text-sm text-slate-700 leading-relaxed max-h-[400px] overflow-y-auto custom-scrollbar'>
                <div className='reset-tw'>
                  <Markdown>{item.content}</Markdown>
                </div>
              </div>
            )}
          </div>
        )
      }
    </div>
  );
};


export default CreationItem