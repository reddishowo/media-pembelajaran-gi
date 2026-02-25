'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ClipboardList, MessageCircle, Send, Save, PenTool, ArrowLeft, CheckCircle, Loader2, X, Minimize2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveLKPD, getGroupData, sendChatMessage, getChatMessages } from '../actions';

type ChatMessage = { _id: string; groupName: string; userName: string; message: string; createdAt: string; };

export default function InvestigasiPage() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [userName, setUserName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // State untuk Floating Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // State LKPD Form
  const [lkpd, setLkpd] = useState({
    variabel: '', alatBahan: '', mekanisme: '', evaluasi: '', draft: ''
  });

  // State Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCount = useRef(0);

  useEffect(() => {
    // 1. Baca Sesi dari Browser
    const sessionStr = localStorage.getItem('gi_session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      setGroupName(session.groupName);
      setUserName(session.members[0] || 'Anggota');
      
      // 2. Ambil LKPD tersimpan dari MONGODB
      getGroupData(session.groupName).then((data: any) => {
        if (data && data.lkpd) setLkpd(data.lkpd);
      });
    }
  }, []);

  // 3. Polling Chat dari MONGODB (Update tiap 2 detik)
  useEffect(() => {
    if (!groupName) return;
    const fetchChat = async () => {
        const chatData = await getChatMessages(groupName);
        setMessages(chatData);

        // Logic untuk notifikasi merah jika ada pesan baru saat chat tertutup
        if (chatData.length > prevMessageCount.current) {
            if (!isChatOpen) {
                setHasNewMessage(true);
            }
            prevMessageCount.current = chatData.length;
        }
    };
    fetchChat(); 
    const interval = setInterval(fetchChat, 2000); 
    return () => clearInterval(interval);
  }, [groupName, isChatOpen]);

  // Auto scroll saat chat terbuka
  useEffect(() => { 
    if(isChatOpen) {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setHasNewMessage(false); // Hilangkan notifikasi merah
    }
  }, [messages, isChatOpen]);

  // Handler Simpan LKPD ke DB
  const handleSaveLKPD = async () => {
      setIsSaving(true);
      await saveLKPD(groupName, lkpd);
      setIsSaving(false);
      alert('Data LKPD berhasil disimpan ke Database Server!');
  };

  // Handler Kirim Chat ke DB
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !groupName) return;
    
    // Optimistic UI update
    const tempMsg = { _id: Date.now().toString(), groupName, userName, message: newMessage, createdAt: new Date().toISOString() };
    setMessages([...messages, tempMsg]);
    setNewMessage(''); 
    prevMessageCount.current += 1; // Update counter lokal agar tidak trigger notifikasi sendiri

    // Simpan ke DB
    await sendChatMessage(groupName, userName, tempMsg.message);
  };

  return (
    <div className="min-h-screen bg-[#f7fdf9] font-sans pb-20 relative">
      
      {/* 
        MAIN CONTENT: LKPD (Sekarang Full Width & Centered) 
      */}
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
         {/* Header Page */}
         <div className="bg-white border-b border-emerald-100 p-4 rounded-t-2xl flex items-center justify-between shadow-sm z-10 sticky top-0">
            <div className="flex items-center gap-3">
                <Link href="/materi" className="p-2 hover:bg-emerald-50 rounded-full text-emerald-600 transition"><ArrowLeft size={20} /></Link>
                <div><h1 className="font-bold text-emerald-900 text-lg leading-none">LKPD Investigasi</h1><p className="text-xs text-emerald-600">Terhubung ke Database</p></div>
            </div>
            <button onClick={() => router.push('/presentasi')} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center gap-2 transition"><CheckCircle size={16} /> Selesai</button>
         </div>

         {/* Form Area */}
         <div className="bg-white p-8 rounded-b-2xl shadow-sm border border-emerald-100 min-h-[80vh]">
            <header className="mb-8 border-b border-slate-100 pb-6">
                <h1 className="text-3xl font-bold text-emerald-900 mb-2">Lembar Kerja Investigasi</h1>
                <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-medium">Kelompok: {groupName}</div>
            </header>

            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                {/* Bagian A */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-emerald-800"><div className="bg-emerald-100 p-2 rounded-lg"><ClipboardList size={24}/></div><h3 className="font-bold text-xl">A. Perencanaan Investigasi</h3></div>
                    <div className="space-y-6 pl-2 md:pl-12">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">1. Variabel apa yang akan kalian amati?</label>
                            <input type="text" value={lkpd.variabel} onChange={e=>setLkpd({...lkpd, variabel:e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 outline-none transition" placeholder="Tulis variabel bebas dan terikat..." />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">2. Alat & Bahan yang dibutuhkan:</label>
                            <textarea rows={3} value={lkpd.alatBahan} onChange={e=>setLkpd({...lkpd, alatBahan:e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 outline-none transition" placeholder="Sebutkan alat dan bahan secara rinci..."></textarea>
                        </div>
                    </div>
                </section>

                {/* Bagian B */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-emerald-800"><div className="bg-emerald-100 p-2 rounded-lg"><PenTool size={24}/></div><h3 className="font-bold text-xl">B. Analisis (HOTS)</h3></div>
                    <div className="space-y-6 pl-2 md:pl-12">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">1. Jelaskan mekanisme biologisnya!</label>
                            <textarea rows={5} value={lkpd.mekanisme} onChange={e=>setLkpd({...lkpd, mekanisme:e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 outline-none transition" placeholder="Jelaskan prosesnya secara ilmiah..."></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">2. Evaluasi informasi:</label>
                            <textarea rows={3} value={lkpd.evaluasi} onChange={e=>setLkpd({...lkpd, evaluasi:e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 outline-none transition" placeholder="Apakah data yang didapat valid?"></textarea>
                        </div>
                    </div>
                </section>

                {/* Bagian C */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-emerald-800"><div className="bg-emerald-100 p-2 rounded-lg"><Save size={24}/></div><h3 className="font-bold text-xl">C. Draft Laporan</h3></div>
                    <div className="pl-2 md:pl-12">
                         <textarea rows={6} value={lkpd.draft} onChange={e=>setLkpd({...lkpd, draft:e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 outline-none transition" placeholder="Tuliskan kerangka laporan akhir di sini..."></textarea>
                    </div>
                </section>

                <div className="flex justify-end pt-6 border-t border-slate-100">
                    <button type="button" onClick={handleSaveLKPD} disabled={isSaving} className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transform active:scale-95 transition flex items-center gap-2">
                        {isSaving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />} Simpan LKPD ke Database
                    </button>
                </div>
            </form>
         </div>
      </div>


      {/* 
        FLOATING CHAT WIDGET (Pojok Kanan Bawah)
      */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        
        {/* Chat Window (Muncul saat isChatOpen = true) */}
        {isChatOpen && (
            <div className="w-87.5 md:w-100 h-125 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 origin-bottom-right">
                {/* Header */}
                <div className="bg-emerald-600 p-4 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <MessageCircle size={20} />
                        <div>
                            <h3 className="font-bold text-sm">Diskusi Kelompok</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-[10px] opacity-90">Online • {groupName}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsChatOpen(false)} className="hover:bg-emerald-700 p-1 rounded transition"><Minimize2 size={18}/></button>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 scrollbar-thin scrollbar-thumb-slate-200">
                    {messages.length === 0 && (
                        <div className="text-center text-slate-400 text-xs mt-10">
                            Belum ada pesan. Mulai diskusi sekarang!
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div key={msg._id} className={`flex flex-col ${msg.userName === userName ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-xl text-sm shadow-sm ${msg.userName === userName ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                            <div className={`font-bold text-[10px] mb-1 ${msg.userName === userName ? 'text-emerald-100' : 'text-emerald-600'}`}>{msg.userName}</div>
                            {msg.message}
                            </div>
                            <span className="text-[9px] text-slate-400 mt-1 px-1">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 shrink-0">
                    <div className="flex gap-2">
                        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Ketik pesan..." className="flex-1 bg-slate-100 border-0 rounded-full px-4 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-400 outline-none" />
                        <button type="submit" disabled={!newMessage.trim()} className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition shadow-md transform active:scale-95"><Send size={18} /></button>
                    </div>
                </form>
            </div>
        )}

        {/* Floating Button (Toggle) */}
        <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`
                relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95
                ${isChatOpen ? 'bg-slate-700 text-white rotate-90' : 'bg-emerald-500 text-white hover:bg-emerald-600'}
            `}
        >
            {isChatOpen ? <X size={24} /> : <MessageCircle size={28} />}
            
            {/* Red Dot Notification */}
            {!isChatOpen && hasNewMessage && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-bounce"></span>
            )}
        </button>

      </div>
    </div>
  );
}