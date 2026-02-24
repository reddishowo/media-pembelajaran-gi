import React from 'react';
import { BookOpen, HelpCircle, Play, Microscope, FlaskConical, ShieldCheck, Search } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#f7fdf9] text-slate-800 font-sans">
      {/* Navigation / Header */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo UM Placeholder */}
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg transform rotate-3">
              UM
            </div>
            <div>
              <span className="font-bold text-emerald-900 text-lg block leading-none">
                Micro-Literacy
              </span>
              <span className="text-emerald-500 font-medium text-[10px] uppercase tracking-wider">
                Group Investigation Model
              </span>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Pengembang</div>
            <div className="text-xs text-emerald-700 font-semibold">Nafisa Syafaqoh</div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Sambutan & Hero Section */}
        <section className="mb-16 text-center">
          <div className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
            🔬 Modul Interaktif Biologi
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-900 mb-6 leading-tight">
            Eksplorasi Dunia Mikro: <br/>
            <span className="text-emerald-600 italic">Literasi Sains dalam Investigasi</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Selamat datang! Di sini kita tidak hanya menghafal, tapi menginvestigasi bagaimana Virus, Bakteri, dan Jamur bekerja dalam kehidupan. Siapkan dirimu untuk menjadi peneliti muda yang kritis dan berbasis data.
          </p>
        </section>

        {/* Fitur Utama / Ringkasan Materi */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: <Microscope size={20}/>, label: "Struktur & Ciri" },
            { icon: <FlaskConical size={20}/>, label: "Proses Biologis" },
            { icon: <ShieldCheck size={20}/>, label: "Penerapan Nyata" },
            { icon: <Search size={20}/>, label: "Metode Ilmiah" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-emerald-50 p-4 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <div className="text-emerald-500 mb-2">{item.icon}</div>
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-tighter">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Capaian Pembelajaran / KD */}
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-emerald-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-900">
                <BookOpen size={120} />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500 rounded-lg text-white">
                <BookOpen size={24} />
              </div>
              <h2 className="text-xl font-bold text-emerald-900">Capaian Pembelajaran</h2>
            </div>
            <ul className="space-y-4 text-slate-700 text-sm md:text-base relative z-10">
              <li className="flex gap-3">
                <div className="h-2 w-2 bg-emerald-400 rounded-full mt-2 shrink-0"></div>
                <span>Menganalisis karakteristik dan peran <strong>mikroorganisme</strong> melalui tinjauan literasi sains yang kritis.</span>
              </li>
              <li className="flex gap-3">
                <div className="h-2 w-2 bg-emerald-400 rounded-full mt-2 shrink-0"></div>
                <span>Memahami proses biologis (infeksi, fermentasi) dan dampaknya bagi <strong>kesehatan & lingkungan</strong>.</span>
              </li>
              <li className="flex gap-3">
                <div className="h-2 w-2 bg-emerald-400 rounded-full mt-2 shrink-0"></div>
                <span>Mampu mengevaluasi informasi ilmiah untuk <strong>pengambilan keputusan</strong> berbasis sains dalam kehidupan sehari-hari.</span>
              </li>
            </ul>
          </div>

          {/* Petunjuk Penggunaan */}
          <div className="bg-emerald-900 p-8 rounded-4xl shadow-xl text-emerald-50 relative overflow-hidden">
             <div className="flex items-center gap-3 mb-6 border-b border-emerald-800 pb-4">
              <div className="p-2 bg-emerald-700 rounded-lg text-emerald-100">
                <HelpCircle size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Langkah Investigasi (GI)</h2>
            </div>
            <ol className="space-y-4 text-emerald-100/90 text-sm md:text-base">
              <li className="flex gap-3">
                <span className="font-black text-emerald-400">01.</span>
                <span><strong>Identifikasi Topik:</strong> Pilih fenomena mikroorganisme di sekitar kita.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-black text-emerald-400">02.</span>
                <span><strong>Perencanaan:</strong> Bagi tugas kelompok untuk merancang eksperimen/studi literatur.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-black text-emerald-400">03.</span>
                <span><strong>Investigasi:</strong> Kumpulkan data, uji hipotesis, dan diskusikan temuan.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-black text-emerald-400">04.</span>
                <span><strong>Analisis & Presentasi:</strong> Evaluasi informasi dan sajikan solusi berbasis sains.</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Tombol Mulai Investigasi */}
        <div className="flex flex-col items-center justify-center gap-6">
          <Link href="/identifikasi" className="group relative bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-4">
            <Play fill="currentColor" size={24} />
            Mulai Investigasi Sekarang
          </Link>
          <p className="text-emerald-600/60 text-xs font-medium tracking-widest uppercase">
            Scientific Literacy & Discovery Learning
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-10 bg-white border-t border-emerald-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-emerald-900 font-bold">Media Pembelajaran Biologi</p>
            <p className="text-emerald-600/70 text-sm">Universitas Negeri Malang</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-slate-500 text-sm">Dikembangkan oleh:</p>
            <p className="text-emerald-700 font-bold italic">Nafisa Syafaqoh (NIM 240341607164)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}