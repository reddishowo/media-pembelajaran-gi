'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, MessageSquare, Star, UserCheck, FileText, ArrowRight, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Import aksi forum dari actions.ts
import { sendForumMessage, getForumMessages } from '../actions';

type ForumMessage = {
  _id: string;
  groupName: string;
  userName: string;
  message: string;
  createdAt: string;
};

export default function PresentasiPage() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [userName, setUserName] = useState('');
  
  // State Simulasi Upload & Nilai
  const [isUploaded, setIsUploaded] = useState(false);
  const [peerScore, setPeerScore] = useState<{ [key: string]: number }>({ kel1: 0, kel2: 0 });

  // State Live Forum
  const [forumMessages, setForumMessages] = useState<ForumMessage[]>([]);
  const [newComment, setNewComment] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 1. Ambil Sesi saat komponen dimuat
  useEffect(() => {
    const data = localStorage.getItem('gi_session');
    if (data) {
        const parsed = JSON.parse(data);
        setGroupName(parsed.groupName);
        setUserName(parsed.members[0] || 'Anggota');
    }
  }, []);

  // 2. Polling Live Forum (Update tiap 2 detik)
  useEffect(() => {
    const fetchForum = async () => {
        const msgs = await getForumMessages();
        setForumMessages(msgs);
    };
    
    fetchForum(); // Panggilan pertama
    const interval = setInterval(fetchForum, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [forumMessages]);

  const handleUpload = () => {
    const btn = document.getElementById('upload-btn');
    if(btn) btn.innerText = 'Mengunggah...';
    setTimeout(() => {
        setIsUploaded(true);
        alert('File presentasi berhasil diunggah ke server kelas!');
    }, 1500);
  };

  // 3. Kirim Komentar ke DB
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newComment.trim() || !groupName) return;

    // Optimistic Update (Muncul di layar langsung)
    const tempMsg = {
        _id: Date.now().toString(),
        groupName,
        userName,
        message: newComment,
        createdAt: new Date().toISOString()
    };
    setForumMessages([...forumMessages, tempMsg]);
    setNewComment('');

    // Simpan ke DB
    await sendForumMessage(groupName, userName, tempMsg.message);
  };

  const handleNext = () => {
    if(!isUploaded) {
        alert('Harap unggah hasil presentasi kelompok terlebih dahulu!');
        return;
    }
    router.push('/evaluasi');
  };

  return (
    <div className="min-h-screen bg-[#f7fdf9] font-sans pb-28">
      {/* Navbar */}
      <nav className="bg-white px-6 py-4 shadow-sm flex items-center gap-4 sticky top-0 z-10 border-b border-emerald-100">
        <Link href="/investigasi" className="p-2 hover:bg-emerald-50 rounded-full text-emerald-600 transition">
            <ArrowLeft size={20} />
        </Link>
        <div>
            <h1 className="font-bold text-emerald-900 text-lg">Presentasi & Diskusi</h1>
            <p className="text-xs text-slate-500">Fase 4 & 5: Analisis & Evaluasi</p>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-8">
        
        {/* KOLOM KIRI: Upload & Peer Assessment */}
        <div className="space-y-8">
            {/* 1. Upload Hasil */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <div className="flex items-center gap-2 mb-4 text-emerald-800 border-b border-emerald-50 pb-2">
                    <UploadCloud size={20} />
                    <h3 className="font-bold text-lg">Upload Hasil Investigasi</h3>
                </div>
                
                {!isUploaded ? (
                    <div className="border-2 border-dashed border-emerald-200 rounded-xl p-8 text-center bg-emerald-50/50 hover:bg-emerald-50 transition cursor-pointer group">
                        <UploadCloud size={40} className="mx-auto text-emerald-300 group-hover:text-emerald-500 mb-2 transition"/>
                        <p className="text-sm text-slate-500 mb-4">Seret file PPT/PDF laporan di sini atau klik untuk mencari.</p>
                        <button 
                            id="upload-btn"
                            onClick={handleUpload}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-md"
                        >
                            Pilih File
                        </button>
                    </div>
                ) : (
                    <div className="bg-emerald-100 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileText className="text-emerald-600" size={24}/>
                            <div>
                                <p className="font-bold text-emerald-900 text-sm">Laporan_Investigasi_{groupName}.pdf</p>
                                <p className="text-xs text-emerald-600">Terunggah - Siap Dipresentasikan</p>
                            </div>
                        </div>
                        <div className="bg-white p-1 rounded-full text-emerald-500"><UserCheck size={16}/></div>
                    </div>
                )}
            </section>

            {/* 2. Peer Assessment (Penilaian Antar Kelompok) */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <div className="flex items-center gap-2 mb-4 text-emerald-800 border-b border-emerald-50 pb-2">
                    <Star size={20} />
                    <h3 className="font-bold text-lg">Penilaian Antar Kelompok</h3>
                </div>
                <p className="text-sm text-slate-500 mb-4">Berikan nilai (1-10) untuk presentasi kelompok lain.</p>
                
                <div className="space-y-4">
                    {['Kelompok Virus A', 'Kelompok Jamur B'].map((kel, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="font-medium text-slate-700 text-sm">{kel}</span>
                            <div className="flex items-center gap-2">
                                {/* PERBAIKAN WARNA INPUT DISINI */}
                                <input 
                                    type="number" 
                                    min="1" max="10" 
                                    className="w-16 p-2 rounded-lg border border-slate-300 text-center text-slate-800 focus:ring-2 focus:ring-emerald-400 outline-none"
                                    placeholder="0"
                                    onChange={(e) => setPeerScore({...peerScore, [`kel${idx}`]: parseInt(e.target.value)})}
                                />
                                <span className="text-xs text-slate-400">/10</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>

        {/* KOLOM KANAN: Forum Diskusi Kelas (LIVE) */}
        <div className="space-y-8 h-150 flex flex-col">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 h-full flex flex-col relative overflow-hidden">
                
                <div className="flex items-center gap-2 mb-4 text-emerald-800 border-b border-emerald-50 pb-2">
                    <MessageSquare size={20} />
                    <div>
                        <h3 className="font-bold text-lg leading-tight">Forum Tanya Jawab Kelas</h3>
                        <p className="text-[10px] text-emerald-500">Live Global Chat</p>
                    </div>
                </div>

                {/* Komentar Guru Special Box (Static Placeholder) */}
                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl mb-4 shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-[10px] font-bold text-yellow-800">G</div>
                        <span className="font-bold text-yellow-800 text-xs">Komentar Guru</span>
                    </div>
                    <p className="text-sm text-slate-700 italic">"Perhatikan sesi presentasi teman kalian. Silakan bertanya melalui forum ini!"</p>
                </div>

                {/* List Komentar LIVE */}
                <div className="flex-1 space-y-4 mb-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-100 pb-4">
                    {forumMessages.length === 0 && (
                        <p className="text-center text-sm text-slate-400 mt-10">Belum ada diskusi kelas. Jadilah yang pertama bertanya!</p>
                    )}
                    {forumMessages.map((com) => {
                        const isMe = com.groupName === groupName;
                        return (
                            <div key={com._id} className={`p-3 rounded-xl text-sm shadow-sm ${isMe ? 'bg-emerald-50 ml-8 border border-emerald-200' : 'bg-slate-50 mr-8 border border-slate-200'}`}>
                                <div className={`font-bold text-[11px] mb-1 ${isMe ? 'text-emerald-700' : 'text-slate-600'}`}>
                                    [{com.groupName}] - {com.userName}
                                </div>
                                <div className="text-slate-800">{com.message}</div>
                                <div className="text-[9px] text-slate-400 mt-1 text-right">
                                    {new Date(com.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Komentar */}
                <form onSubmit={handlePostComment} className="mt-auto shrink-0 pt-2 border-t border-slate-50">
                    <div className="flex gap-2">
                        {/* PERBAIKAN WARNA TEKS DISINI */}
                        <input 
                            type="text" 
                            className="flex-1 bg-slate-100 border-0 rounded-full px-4 py-3 text-slate-800 placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                            placeholder="Tulis pertanyaan atau tanggapan..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit" disabled={!newComment.trim()} className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white p-3 rounded-full shadow-md transition transform active:scale-95">
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </section>
        </div>

      </main>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-emerald-100 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-30">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="hidden md:block text-xs text-slate-500">
                Pastikan presentasi selesai sebelum lanjut evaluasi.
            </div>
            <button 
                onClick={handleNext}
                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-emerald-200/50 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
                Lanjut ke Evaluasi & Refleksi
                <ArrowRight size={20} />
            </button>
        </div>
      </div>
    </div>
  );
}