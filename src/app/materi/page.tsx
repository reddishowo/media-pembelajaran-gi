'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Video, ExternalLink, Image as ImageIcon, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, Copy, CheckCircle2, UserCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function MateriPage() {
  const [activeTab, setActiveTab] = useState('virus');
  const [videoIndex, setVideoIndex] = useState(0); 

  // State untuk Profil User (Diambil dari LocalStorage Sesi)
  const [sessionInfo, setSessionInfo] = useState({ groupName: '', userName: '', role: '', groupCode: '' });
  const [copied, setCopied] = useState(false); // Untuk efek animasi copy kode

  // Otomatis pilih tab sesuai topik & Load Profil
  useEffect(() => {
    const data = localStorage.getItem('gi_session');
    if(data) {
        const parsed = JSON.parse(data);
        setSessionInfo(parsed);
        if(parsed.topic && ['virus', 'bakteri', 'jamur'].includes(parsed.topic)) {
            setActiveTab(parsed.topic);
        }
    }
  }, []);

  // Reset video ke Part 1 setiap kali ganti Tab
  useEffect(() => {
    setVideoIndex(0);
  }, [activeTab]);

  // Fungsi untuk Copy Kode Kelompok (Bagi Ketua)
  const handleCopyCode = () => {
      navigator.clipboard.writeText(sessionInfo.groupCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const content = {
    // ... [Isi content Virus, Bakteri, Jamur sama seperti sebelumnya] ...
    virus: {
      title: 'Virus: Organisme Peralihan',
      desc: 'Virus bukan sel hidup, melainkan materi genetik yang terbungkus protein. Mereka membutuhkan inang untuk bereproduksi.',
      youtubeIds: ['8glI_X1XoBE'],
      infographicSrc: '/infografis/virus.png', 
      articles: [
        { title: 'Struktur dan Bentuk Virus (Kompas)', url: 'https://www.kompas.com/skola/read/2020/12/26/164741669/struktur-tubuh-virus' },
        { title: 'Bagaimana Vaksin Bekerja? (WHO)', url: 'https://www.who.int/news-room/feature-stories/detail/how-do-vaccines-work' },
      ]
    },
    bakteri: {
      title: 'Bakteri: Prokariota Sejati',
      desc: 'Organisme bersel tunggal tanpa membran inti. Memiliki peran ganda: patogen penyebab penyakit dan dekomposer lingkungan.',
      youtubeIds: ['ZysZy1OfGII', 'qQMwb7VJ-Dc'], 
      infographicSrc: '/infografis/bakteri.jpg', 
      articles: [
        { title: 'Peranan Bakteri dalam Kehidupan (Ruangguru)', url: 'https://www.ruangguru.com/blog/biologi-kelas-10-peranan-bakteri-dalam-kehidupan' },
        { title: 'Resistensi Antibiotik (Kemenkes)', url: 'https://yankes.kemkes.go.id/view_artikel/1049/resistensi-antibiotik' },
      ]
    },
    jamur: {
      title: 'Jamur (Fungi): Dekomposer Alami',
      desc: 'Eukariota yang tidak memiliki klorofil. Hidup sebagai saprofit atau parasit, dan bereproduksi dengan spora.',
      youtubeIds: ['mtx7xk-7KqQ'],
      infographicSrc: '/infografis/jamur.png', 
      articles: [
        { title: 'Ciri-Ciri Kingdom Fungi (Gramedia)', url: 'https://www.gramedia.com/literasi/kingdom-fungi/' },
        { title: 'Fermentasi Tempe: Peran Rhizopus (BRIN)', url: 'https://lipi.go.id/berita/single/bioteknologi-fermentasi-tempe/1234' },
      ]
    }
  };

  const activeContent = content[activeTab as keyof typeof content];
  const hasMultipleVideos = activeContent.youtubeIds && activeContent.youtubeIds.length > 1;

  return (
    <div className="min-h-screen bg-[#f0f9f4] text-slate-800 pb-28 font-sans">
       
       {/* ================= NAVBAR DENGAN PROFIL ================= */}
       <nav className="bg-white px-4 md:px-8 py-3 shadow-sm flex items-center justify-between sticky top-0 z-10 border-b border-emerald-100">
        <div className="flex items-center gap-3">
            <Link href="/" className="p-2 bg-slate-50 hover:bg-emerald-50 rounded-full text-emerald-600 transition">
                <ArrowLeft size={18} />
            </Link>
            <div className="hidden sm:block">
                <h1 className="font-bold text-emerald-900 text-lg leading-tight">Materi Pembelajaran</h1>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Langkah 2 dari 3</p>
            </div>
        </div>

        {/* Profil Card (Pojok Kanan) */}
        {sessionInfo.userName && (
            <div className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-100 px-3 py-1.5 rounded-full">
                {/* Avatar Icon */}
                <div className="bg-emerald-200 text-emerald-700 p-1.5 rounded-full">
                    <UserCircle2 size={18} />
                </div>
                
                {/* Info User */}
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-emerald-900 leading-none">
                        {sessionInfo.userName} <span className="text-emerald-500 font-normal">({sessionInfo.groupName})</span>
                    </span>
                    
                    {/* Logika Tampilan Kode Khusus Ketua */}
                    {sessionInfo.role === 'leader' ? (
                        <div 
                            onClick={handleCopyCode}
                            className="flex items-center gap-1 text-[10px] text-emerald-600 cursor-pointer hover:text-emerald-800 transition mt-0.5 group"
                            title="Klik untuk menyalin kode!"
                        >
                            <span className="font-medium">Kode: <span className="font-mono font-bold tracking-widest">{sessionInfo.groupCode}</span></span>
                            {copied ? <CheckCircle2 size={12} className="text-green-500"/> : <Copy size={10} className="opacity-50 group-hover:opacity-100"/>}
                        </div>
                    ) : (
                        <span className="text-[10px] text-slate-500 font-medium mt-0.5">Anggota Tim</span>
                    )}
                </div>
            </div>
        )}
      </nav>
      {/* ======================================================== */}

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {['virus', 'bakteri', 'jamur'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-bold capitalize whitespace-nowrap transition-all ${
                activeTab === tab 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'bg-white text-slate-500 hover:bg-emerald-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
              <h2 className="text-2xl font-bold text-emerald-900 mb-2">{activeContent.title}</h2>
              <p className="text-slate-600 leading-relaxed">{activeContent.desc}</p>
            </div>

            {/* Video Player Container */}
            <div className="space-y-4">
                <div className="bg-black rounded-2xl aspect-video overflow-hidden shadow-lg relative group">
                {activeContent.youtubeIds && activeContent.youtubeIds.length > 0 ? (
                    <iframe 
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${activeContent.youtubeIds[videoIndex]}`} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    ></iframe>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900">
                    <Video size={48} className="text-slate-600 mb-2" />
                    <p className="text-sm font-medium">Video belum tersedia untuk topik ini.</p>
                    </div>
                )}
                </div>

                {/* Video Navigation Controls */}
                {hasMultipleVideos && (
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                        <button 
                            onClick={() => setVideoIndex(Math.max(0, videoIndex - 1))}
                            disabled={videoIndex === 0}
                            className="flex items-center gap-1 text-sm font-bold px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeft size={16} /> Part {videoIndex}
                        </button>

                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Video Part {videoIndex + 1} / {activeContent.youtubeIds.length}
                        </span>

                        <button 
                            onClick={() => setVideoIndex(Math.min(activeContent.youtubeIds.length - 1, videoIndex + 1))}
                            disabled={videoIndex === activeContent.youtubeIds.length - 1}
                            className="flex items-center gap-1 text-sm font-bold px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Part {videoIndex + 2} <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Infografis Section */}
            {activeContent.infographicSrc ? (
              <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="p-4 bg-emerald-50/50 border-b border-emerald-50 flex items-center justify-between">
                    <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                        <ImageIcon size={20} className="text-emerald-600"/>
                        Infografis Struktur
                    </h3>
                    <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full font-bold uppercase">Gambar</span>
                </div>
                <div className="p-4 bg-slate-50">
                    <img 
                        src={activeContent.infographicSrc} 
                        alt={`Infografis ${activeTab}`} 
                        className="w-full h-auto rounded-lg shadow-sm border border-slate-200"
                    />
                    <div className="mt-2 text-center">
                        <a 
                            href={activeContent.infographicSrc} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline font-medium"
                        >
                            <ZoomIn size={14} /> Lihat Ukuran Penuh
                        </a>
                    </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <ImageIcon size={40} className="text-emerald-300 mb-2" />
                <h3 className="font-bold text-emerald-800">Infografis Struktur {activeTab}</h3>
                <p className="text-xs text-emerald-600 mt-1">Gambar belum tersedia untuk topik ini</p>
              </div>
            )}

          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={20} className="text-emerald-600" />
                <h3 className="font-bold text-lg">Literatur Sains</h3>
              </div>
              <ul className="space-y-4">
                {activeContent.articles.map((article, idx) => (
                  <li key={idx}>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="group block p-3 rounded-xl hover:bg-emerald-50 transition border border-slate-100 hover:border-emerald-200">
                      <div className="text-sm font-semibold text-emerald-900 group-hover:underline mb-1">{article.title}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-500"><ExternalLink size={12} /> Baca Artikel Sumber</div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-emerald-100 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-30">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500 text-center md:text-left">
                Sudah mempelajari materi? Saatnya investigasi!
            </div>
            <Link href="/investigasi" className="w-full md:w-auto group bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-emerald-200/50 flex items-center justify-center gap-2 transition-all transform active:scale-95">
                Lanjut ke LKPD & Investigasi
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
        </div>
      </div>
    </div>
  );
}