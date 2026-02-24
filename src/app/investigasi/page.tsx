'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ClipboardList, MessageCircle, Send, Save, PenTool, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveLKPD, getGroupData, sendChatMessage, getChatMessages } from '../actions';

type ChatMessage = { _id: string; groupName: string; userName: string; message: string; createdAt: string; };

export default function InvestigasiPage() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [userName, setUserName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // State LKPD Form
  const [lkpd, setLkpd] = useState({
    variabel: '', alatBahan: '', mekanisme: '', evaluasi: '', draft: ''
  });

  // State Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

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
    };
    fetchChat(); // Ambil pertama kali
    const interval = setInterval(fetchChat, 2000); 
    return () => clearInterval(interval);
  }, [groupName]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

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
    
    // Optimistic UI update (tampil di layar dulu)
    const tempMsg = { _id: Date.now().toString(), groupName, userName, message: newMessage, createdAt: new Date().toISOString() };
    setMessages([...messages, tempMsg]);
    setNewMessage(''); 

    // Simpan ke DB
    await sendChatMessage(groupName, userName, tempMsg.message);
  };

  return (
    <div className="min-h-screen bg-[#f7fdf9] font-sans flex flex-col md:flex-row">
      {/* LEFT SIDE: LKPD */}
      <div className="w-full md:w-2/3 flex flex-col h-screen">
         <div className="bg-white border-b border-emerald-100 p-4 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-3">
                <Link href="/materi" className="p-2 hover:bg-emerald-50 rounded-full text-emerald-600 transition"><ArrowLeft size={20} /></Link>
                <div><h1 className="font-bold text-emerald-900 text-lg leading-none">LKPD Investigasi</h1><p className="text-xs text-emerald-600">Terhubung ke Database</p></div>
            </div>
            <button onClick={() => router.push('/presentasi')} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 px-4 rounded-full flex items-center gap-2 transition"><CheckCircle size={16} /> Selesai</button>
         </div>

         <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-32">
            <header className="mb-8"><h1 className="text-2xl font-bold text-emerald-900 mb-2">Lembar Kerja Investigasi</h1><div className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg text-sm font-medium">Kelompok: {groupName}</div></header>

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <div className="flex items-center gap-2 mb-4 text-emerald-800"><div className="bg-emerald-100 p-2 rounded-lg"><ClipboardList size={20}/></div><h3 className="font-bold">A. Perencanaan Investigasi</h3></div>
                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">1. Variabel apa yang akan kalian amati?</label>
                    <input type="text" value={lkpd.variabel} onChange={e=>setLkpd({...lkpd, variabel:e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">2. Alat & Bahan yang dibutuhkan:</label>
                    <textarea rows={2} value={lkpd.alatBahan} onChange={e=>setLkpd({...lkpd, alatBahan:e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 outline-none"></textarea>
                </div>
                </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <div className="flex items-center gap-2 mb-4 text-emerald-800"><div className="bg-emerald-100 p-2 rounded-lg"><PenTool size={20}/></div><h3 className="font-bold">B. Analisis (HOTS)</h3></div>
                <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">1. Jelaskan mekanisme biologisnya!</label>
                    <textarea rows={4} value={lkpd.mekanisme} onChange={e=>setLkpd({...lkpd, mekanisme:e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-emerald-400 outline-none"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">2. Evaluasi informasi:</label>
                    <textarea rows={3} value={lkpd.evaluasi} onChange={e=>setLkpd({...lkpd, evaluasi:e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-emerald-400 outline-none"></textarea>
                </div>
                </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <div className="flex items-center gap-2 mb-4 text-emerald-800"><div className="bg-emerald-100 p-2 rounded-lg"><Save size={20}/></div><h3 className="font-bold">C. Draft Laporan</h3></div>
                <textarea rows={5} value={lkpd.draft} onChange={e=>setLkpd({...lkpd, draft:e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-emerald-400 outline-none"></textarea>
            </section>

            <button type="button" onClick={handleSaveLKPD} disabled={isSaving} className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-6 py-3 rounded-xl font-bold hover:bg-emerald-200 w-full md:w-auto flex items-center justify-center gap-2">
                {isSaving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />} Simpan LKPD ke Database
            </button>
            </form>
         </div>
      </div>

      {/* RIGHT SIDE: Diskusi (MONGODB) */}
      <div className="w-full md:w-1/3 bg-white border-l border-emerald-100 flex flex-col h-[50vh] md:h-screen fixed bottom-0 md:relative z-20">
        <div className="p-4 bg-emerald-800 text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2"><MessageCircle size={20} /><div><span className="font-bold block text-sm">Diskusi Live</span><span className="text-[10px] text-emerald-200">MongoDB Server</span></div></div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.map((msg) => (
              <div key={msg._id} className={`flex flex-col ${msg.userName === userName ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm shadow-sm ${msg.userName === userName ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                  <div className={`font-bold text-[10px] mb-1 ${msg.userName === userName ? 'text-emerald-100' : 'text-emerald-600'}`}>{msg.userName}</div>
                  {msg.message}
                </div>
              </div>
            ))}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100">
          <div className="flex gap-2">
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Ketik pesan..." className="flex-1 bg-slate-100 border-0 rounded-full px-4 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-400 outline-none" />
            <button type="submit" disabled={!newMessage.trim()} className="p-3 bg-emerald-500 text-white rounded-full"><Send size={18} /></button>
          </div>
        </form>
      </div>
    </div>
  );
}