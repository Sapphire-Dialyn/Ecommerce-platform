'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Sparkles } from 'lucide-react'; 
// 👇 1. Import Redux Hook
import { useAppDispatch, useAppSelector } from '@/hook/useRedux';
import { closeChat, toggleChat } from '@/store/slices/chatSlice';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export default function ChatWidget() {
  // 👇 2. Thay useState bằng Redux Selector
  // Bây giờ widget sẽ nghe lệnh từ Store: "Store bảo mở là mở, bảo đóng là đóng"
  const isOpen = useAppSelector((state) => state.chat.isOpen);
  const dispatch = useAppDispatch();

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Chào nhà cục cưng. Ngọn gió nào đưa bạn đến vùng biển của ta?' }
  ]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMsg: Message = { role: 'user', content: input };
    const newHistory = [...messages, newUserMsg]; 
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: newHistory }) 
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Dòng chảy ký ức bị gián đoạn...' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-9999 font-sans">
      
      {/* Nút mở chat (Floating Bubble) 
          Vẫn giữ nút này để khách có thể mở từ góc màn hình nếu muốn 
      */}
      {!isOpen && (
        <button 
          onClick={() => dispatch(toggleChat())} // 👇 3. Gọi Redux Action
          className="group relative flex items-center justify-center w-16 h-16 bg-linear-to-br from-cyan-600 to-blue-800 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-white/20"
        >
          <span className="absolute w-full h-full rounded-full bg-blue-400 opacity-30 animate-ping"></span>
          <MessageCircle size={30} className="relative z-10 drop-shadow-md" />
        </button>
      )}

      {/* Khung Chat */}
      {isOpen && (
        <div className="w-[380px] h-[600px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-linear-to-r from-slate-900 via-blue-900 to-slate-900 p-5 flex justify-between items-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                    <div className="w-12 h-12 bg-blue-100 rounded-full overflow-hidden border-2 border-blue-300 shadow-inner">
                        <img src="https://i.pinimg.com/736x/79/2c/65/792c65eaa80ffae684ec7125bc31bdd8.jpg" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-slate-900"></div>
                </div>
                <div>
                    <h3 className="font-bold text-lg tracking-tight">Cantarella</h3>
                    <p className="text-xs text-blue-200 flex items-center gap-1 opacity-80"><Sparkles size={10}/> Trợ lý ảo</p>
                </div>
            </div>
            
            {/* 👇 4. Nút đóng: Gọi Redux Action */}
            <button 
                onClick={() => dispatch(closeChat())} 
                className="hover:bg-white/10 p-2 rounded-full transition relative z-10"
            >
                <X size={20}/>
            </button>
          </div>

          {/* Nội dung Chat (Giữ nguyên) */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                {msg.role === 'assistant' && (
                    <div className="w-8 h-8 mr-2 rounded-full bg-blue-100 border border-blue-200 overflow-hidden shrink-0 mt-1">
                        <img src="https://i.pinimg.com/736x/79/2c/65/792c65eaa80ffae684ec7125bc31bdd8.jpg" alt="AI" />
                    </div>
                )}
                <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
                <div className="flex justify-start items-center ml-10">
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            )}
          </div>

          {/* Input (Giữ nguyên) */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2 items-center bg-gray-100/80 px-2 py-2 rounded-3xl focus-within:ring-2 focus-within:ring-blue-100 border border-transparent transition-all">
                <input 
                  type="text" 
                  className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 px-3 py-1"
                  placeholder="Nhập tin nhắn..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={loading}
                />
                <button onClick={handleSend} disabled={loading || !input.trim()} className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition shadow-md">
                  <Send size={18} />
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}