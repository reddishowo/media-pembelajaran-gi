'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ClipboardList, MessageCircle, Send, Save, PenTool, Trash2, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ChatMessage = {
  id: string;
  groupName: string;
  userName: string;
  message: string;
  createdAt: string;
};

export default function InvestigasiPage() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [userName, setUserName] = useState('');
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = localStorage.getItem('gi_group_data');
    if (data) {
      const parsed = JSON.parse(data);
      setGroupName(parsed.groupName);
      setUserName(parsed.members[0] || 'Anggota Anonim'); 
    }
    loadChatFromStorage();
  }, []);

  const loadChatFromStorage = () => {
    const savedChat = localStorage.getItem('gi_chat_history');
    if (savedChat) {
      const parsedChat: ChatMessage[] = JSON.parse(savedChat);
      const groupData = localStorage.getItem('gi_group_data');
      if (groupData) {
        const currentGroup = JSON.parse(groupData).groupName;
        const filtered = parsedChat.filter(c => c.groupName === currentGroup);
        setMessages(filtered);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => { loadChatFromStorage(); }, 1000);
    return () => clearInterval(interval);
  }, [groupName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !groupName) return;

    const newMsgObj: ChatMessage = {
      id: Date.now().toString(),
      groupName,
      userName,
      message: newMessage,
      createdAt: new Date().toISOString(),
    };

    const savedChat = localStorage.getItem('gi_chat_history');
    const allChats = savedChat ? JSON.parse(savedChat) : [];
    const updatedChats = [...allChats, newMsgObj];
    
    localStorage.setItem('gi_chat_history', JSON.stringify(updatedChats));
    setNewMessage(''); 
    loadChatFromStorage(); 
  };

  const clearChat = () => {
    if(confirm('Hapus semua riwayat chat kelompok ini?')) {
       const savedChat = localStorage.getItem('gi_chat_history');
       if (savedChat) {
         const allChats: ChatMessage[] = JSON.parse(savedChat);
         const otherChats = allChats.filter(c => c.groupName !== groupName);
         localStorage.setItem('gi_chat_history', JSON.stringify(otherChats));
         setMessages([]);
       }
    }
  }

  const handleFinish = () => {
      if(confirm('Lanjut ke tahap Presentasi & Diskusi Kelas?')) {
          router.push('/presentasi');
      }
  }

  return (
    <div className="min-h-screen bg-[#f7fdf9] font-sans flex flex-col md:flex-row">
      
      {/* LEFT SIDE: LKPD & Investigasi */}
      <div className="w-full md:w-2/3 flex flex-col h-screen">
         <div className="bg-white border-b border-emerald-100 p-4 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-3">
                <Link href="/materi" className="p-2 hover:bg-emerald-50 rounded-full text-emerald-600 transition">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="font-bold text-emerald-900 text-lg leading-none">LKPD Investigasi</h1>
                    <p className="text-xs text-emerald-600">Langkah 3 dari 3</p>
                </div>
            </div>
            <button 
                onClick={handleFinish}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center gap-2 transition"
            >
                <CheckCircle size={16} />
                Selesai
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-32 scrollbar-thin scrollbar-thumb-emerald-200">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-emerald-900 mb-2">Lembar Kerja Investigasi</h1>
                <div className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg text-sm font-medium">
                    Kelompok: {groupName}
                </div>
            </header>

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <div className="flex items-center gap-2 mb-4 text-emerald-800">
                <div className="bg-emerald-100 p-2 rounded-lg"><ClipboardList size={20}/></div>
                <h3 className="font-bold">A. Perencanaan Investigasi</h3>
                </div>
                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">1. Variabel apa yang akan kalian amati?</label>
                    {/* PERBAIKAN WARNA TEKS DISINI */}
                    <input type="text" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 outline-none transition" placeholder="Contoh: Suhu air, Pertumbuhan jamur..."/>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">2. Alat & Bahan yang dibutuhkan:</label>
                    {/* PERBAIKAN WARNA TEKS DISINI */}
                    <textarea rows={2} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 outline-none transition"></textarea>
                </div>
                </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <div className="flex items-center gap-2 mb-4 text-emerald-800">
                <div className="bg-emerald-100 p-2 rounded-lg"><PenTool size={20}/></div>
                <h3 className="font-bold">B. Investigasi & Analisis (HOTS)</h3>
                </div>
                <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                    <strong>Pertanyaan Analisis:</strong> Berdasarkan data yang kalian temukan di materi/artikel, jawablah pertanyaan berikut.
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">1. Mengapa mikroorganisme tersebut bisa menyebabkan dampak tersebut? Jelaskan mekanisme biologisnya!</label>
                    {/* PERBAIKAN WARNA TEKS DISINI */}
                    <textarea rows={4} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 outline-none transition"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">2. Evaluasi: Apakah informasi yang kalian temukan konsisten?</label>
                    {/* PERBAIKAN WARNA TEKS DISINI */}
                    <textarea rows={3} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 outline-none transition"></textarea>
                </div>
                </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <div className="flex items-center gap-2 mb-4 text-emerald-800">
                <div className="bg-emerald-100 p-2 rounded-lg"><Save size={20}/></div>
                <h3 className="font-bold">C. Draft Laporan</h3>
                </div>
                {/* PERBAIKAN WARNA TEKS DISINI */}
                <textarea rows={5} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 outline-none transition" placeholder="Tuliskan kesimpulan sementara..."></textarea>
            </section>

            <button type="button" onClick={() => alert('Progress LKPD Tersimpan di Browser!')} className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-6 py-3 rounded-xl font-bold hover:bg-emerald-200 w-full md:w-auto transform active:scale-95 transition">
                Simpan Progress (Draft)
            </button>
            </form>
         </div>
      </div>

      {/* RIGHT SIDE: Diskusi Kelompok */}
      <div className="w-full md:w-1/3 bg-white border-l border-emerald-100 flex flex-col h-[50vh] md:h-screen fixed bottom-0 md:relative z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] md:shadow-none">
        <div className="p-4 bg-emerald-800 text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} />
            <div>
              <span className="font-bold block text-sm">Diskusi Kelompok</span>
              <span className="text-[10px] text-emerald-200 font-normal">History tersimpan lokal</span>
            </div>
          </div>
          <button onClick={clearChat} className="p-1 hover:bg-emerald-700 rounded text-emerald-200" title="Hapus Chat"><Trash2 size={16}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 scrollbar-thin scrollbar-thumb-slate-200">
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 text-sm mt-10 flex flex-col items-center gap-2">
              <MessageCircle size={32} className="opacity-20"/>
              <p>Mulai diskusi di sini!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.userName === userName ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm shadow-sm ${msg.userName === userName ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                  <div className={`font-bold text-[10px] mb-1 ${msg.userName === userName ? 'text-emerald-100' : 'text-emerald-600'}`}>{msg.userName}</div>
                  {msg.message}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100">
          <div className="flex gap-2">
            {/* PERBAIKAN WARNA TEKS DISINI */}
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Ketik pesan..." className="flex-1 bg-slate-100 border-0 rounded-full px-4 text-slate-800 placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-emerald-400 outline-none transition" />
            <button type="submit" disabled={!newMessage.trim()} className="p-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white rounded-full transition shadow-md transform active:scale-95"><Send size={18} /></button>
          </div>
        </form>
      </div>
    </div>
  );
}