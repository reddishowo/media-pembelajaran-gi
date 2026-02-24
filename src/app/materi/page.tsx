'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Video, ExternalLink, Image as ImageIcon, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MateriPage() {
  const [activeTab, setActiveTab] = useState('virus');
  // Otomatis pilih tab sesuai topik yang dipilih di halaman sebelumnya (optional enhancement)
  useEffect(() => {
    const data = localStorage.getItem('gi_group_data');
    if(data) {
        const topic = JSON.parse(data).topic;
        if(topic && ['virus', 'bakteri', 'jamur'].includes(topic)) {
            setActiveTab(topic);
        }
    }
  }, []);

  const content = {
    virus: {
      title: 'Virus: Organisme Peralihan',
      desc: 'Virus bukan sel hidup, melainkan materi genetik yang terbungkus protein. Mereka membutuhkan inang untuk bereproduksi.',
      articles: [
        { title: 'Struktur dan Bentuk Virus (Kompas)', url: 'https://www.kompas.com/skola/read/2020/12/26/164741669/struktur-tubuh-virus' },
        { title: 'Bagaimana Vaksin Bekerja? (WHO)', url: 'https://www.who.int/news-room/feature-stories/detail/how-do-vaccines-work' },
      ]
    },
    bakteri: {
      title: 'Bakteri: Prokariota Sejati',
      desc: 'Organisme bersel tunggal tanpa membran inti. Memiliki peran ganda: patogen penyebab penyakit dan dekomposer lingkungan.',
      articles: [
        { title: 'Peranan Bakteri dalam Kehidupan (Ruangguru)', url: 'https://www.ruangguru.com/blog/biologi-kelas-10-peranan-bakteri-dalam-kehidupan' },
        { title: 'Resistensi Antibiotik (Kemenkes)', url: 'https://yankes.kemkes.go.id/view_artikel/1049/resistensi-antibiotik' },
      ]
    },
    jamur: {
      title: 'Jamur (Fungi): Dekomposer Alami',
      desc: 'Eukariota yang tidak memiliki klorofil. Hidup sebagai saprofit atau parasit, dan bereproduksi dengan spora.',
      articles: [
        { title: 'Ciri-Ciri Kingdom Fungi (Gramedia)', url: 'https://www.gramedia.com/literasi/kingdom-fungi/' },
        { title: 'Fermentasi Tempe: Peran Rhizopus (BRIN)', url: 'https://lipi.go.id/berita/single/bioteknologi-fermentasi-tempe/1234' },
      ]
    }
  };

  const activeContent = content[activeTab as keyof typeof content];

  return (
    <div className="min-h-screen bg-[#f0f9f4] text-slate-800 pb-28 font-sans">
       <nav className="bg-white px-6 py-4 shadow-sm flex items-center gap-4 sticky top-0 z-10 border-b border-emerald-100">
        <Link href="/identifikasi" className="p-2 hover:bg-emerald-50 rounded-full text-emerald-600 transition">
            <ArrowLeft size={20} />
        </Link>
        <div>
            <h1 className="font-bold text-emerald-900 text-lg">Materi Pembelajaran</h1>
            <p className="text-xs text-slate-500">Langkah 2 dari 3</p>
        </div>
      </nav>

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
            <div className="bg-slate-900 rounded-2xl aspect-video flex flex-col items-center justify-center text-slate-400 relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
              <Video size={48} className="text-white mb-2 z-10" />
              <span className="text-sm font-medium z-10 text-white">Video Pembelajaran {activeTab}</span>
              <span className="text-xs text-slate-300 z-10">(Placeholder: Embed Youtube Disini)</span>
            </div>
            <div className="bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <ImageIcon size={40} className="text-emerald-300 mb-2" />
              <h3 className="font-bold text-emerald-800">Infografis Struktur {activeTab}</h3>
            </div>
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