'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Sparkles, Loader2 } from 'lucide-react'; 
// 1. Import Redux Hook
import { useAppDispatch, useAppSelector } from '@/hook/useRedux';
import { closeChat, toggleChat } from '@/store/slices/chatSlice';
// 2. Import ReactMarkdown để xử lý link sản phẩm
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export default function ChatWidget() {
  // Thay useState bằng Redux Selector để lắng nghe trạng thái đóng/mở từ Store
  const isOpen = useAppSelector((state) => state.chat.isOpen);
  const dispatch = useAppDispatch();

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Chào bạn. Dòng chảy nào đã đưa bạn đến với bờ biển của ta hôm nay?' }
  ]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới hoặc khi mở chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    const newUserMsg: Message = { role: 'user', content: userMsg };
    
    // Cập nhật UI ngay lập tức với tin nhắn của user
    const newHistory = [...messages, newUserMsg]; 
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      // Gọi API sang Backend (NestJS)
      const res = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: newHistory }) 
      });
      
      const data = await res.json();
      
      // Thêm câu trả lời của AI vào danh sách
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Dòng chảy ký ức bị gián đoạn, ta không thể nghe thấy bạn lúc này...' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Nút Floating Bubble (Chỉ hiện khi khung chat đang đóng) */}
      {!isOpen && (
        <button 
          onClick={() => dispatch(toggleChat())} 
          className="group relative flex items-center justify-center w-16 h-16 bg-linear-to-br from-fuchsia-600 to-indigo-800 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-white/20"
        >
          <span className="absolute w-full h-full rounded-full bg-fuchsia-400 opacity-30 animate-ping"></span>
          <MessageCircle size={30} className="relative z-10 drop-shadow-md" />
        </button>
      )}

      {/* Khung Chat Chính */}
      {isOpen && (
        <div className="w-[380px] h-[600px] bg-white rounded-3xl shadow-2xl border border-fuchsia-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header phong cách Cantarella */}
          <div className="bg-linear-to-r from-slate-900 via-fuchsia-950 to-slate-900 p-5 flex justify-between items-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                    <div className="w-12 h-12 bg-fuchsia-100 rounded-full overflow-hidden border-2 border-fuchsia-300 shadow-inner">
                        <img src="https://i.pinimg.com/736x/79/2c/65/792c65eaa80ffae684ec7125bc31bdd8.jpg" alt="Cantarella Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-slate-900 shadow-sm"></div>
                </div>
                <div>
                    <h3 className="font-bold text-lg tracking-tight font-serif">Cantarella</h3>
                    <p className="text-xs text-fuchsia-200 flex items-center gap-1 opacity-80 uppercase tracking-widest"><Sparkles size={10}/> Trợ lý ảo</p>
                </div>
            </div>
            
            <button 
                onClick={() => dispatch(closeChat())} 
                className="hover:bg-white/10 p-2 rounded-full transition relative z-10"
            >
                <X size={20}/>
            </button>
          </div>

          {/* Khu vực hiển thị tin nhắn có hỗ trợ Markdown */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                {msg.role === 'assistant' && (
                    <div className="w-8 h-8 mr-2 rounded-full bg-fuchsia-100 border border-fuchsia-200 overflow-hidden shrink-0 mt-1 shadow-sm">
                        <img src="https://i.pinimg.com/736x/79/2c/65/792c65eaa80ffae684ec7125bc31bdd8.jpg" alt="AI Avatar Small" className="w-full h-full object-cover" />
                    </div>
                )}
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-fuchsia-600 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-a:text-fuchsia-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline">
                      <ReactMarkdown
                         components={{
                           // Tùy chỉnh thẻ 'a' (link) để mở tab mới và có style đẹp
                           a: ({node, ...props}) => (
                             <a 
                               {...props} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="text-fuchsia-700 font-extrabold hover:text-fuchsia-500 transition-colors"
                             />
                           ),
                           // Loại bỏ margin thừa của các đoạn văn trong khung chat
                           p: ({node, ...props}) => <p {...props} className="mb-1 last:mb-0" />
                         }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            
            {/* Hiệu ứng đang gõ (Typing Indicator) */}
            {loading && (
                <div className="flex justify-start items-center ml-10">
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            )}
          </div>

          {/* Ô nhập tin nhắn */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2 items-center bg-gray-50 px-2 py-2 rounded-3xl focus-within:ring-2 focus-within:ring-fuchsia-100 border border-gray-200 transition-all">
                <input 
                  type="text" 
                  className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 px-3 py-1"
                  placeholder="Hỏi ta về các bảo vật làm đẹp..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={loading}
                />
                <button 
                  onClick={handleSend} 
                  disabled={loading || !input.trim()} 
                  className="w-10 h-10 flex items-center justify-center bg-fuchsia-600 text-white rounded-full hover:bg-fuchsia-700 disabled:opacity-50 transition shadow-md shrink-0 transform active:scale-90"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="-ml-0.5" />}
                </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-2 italic uppercase tracking-tighter"></p>
          </div>
        </div>
      )}
    </div>
  );
}