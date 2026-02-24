'use client';

import React, { useState } from 'react';
import { Award, CheckCircle, Home, BrainCircuit, RotateCcw, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EvaluasiPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1); // 1: Quiz, 2: Refleksi, 3: Selesai
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Data Kuis Sederhana
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const questions = [
    { id: 1, q: "Apa perbedaan utama antara Virus dan Bakteri?", options: ["Virus memiliki sel, Bakteri tidak", "Bakteri dapat hidup mandiri, Virus butuh inang", "Keduanya memiliki inti sel", "Virus lebih besar dari Bakteri"], correct: "Bakteri dapat hidup mandiri, Virus butuh inang" },
    { id: 2, q: "Manakah peran jamur Rhizopus sp. yang menguntungkan?", options: ["Penyebab panu", "Pembuatan tempe", "Penghasil antibiotik", "Pembusukan buah"], correct: "Pembuatan tempe" },
    { id: 3, q: "Dalam metode ilmiah, apa langkah setelah merumuskan masalah?", options: ["Menarik kesimpulan", "Menyusun hipotesis", "Melakukan eksperimen", "Analisis data"], correct: "Menyusun hipotesis" },
  ];

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    questions.forEach(q => {
        if(answers[q.id] === q.correct) score += 1;
    });
    setQuizScore((score / questions.length) * 100);
    setTimeout(() => setActiveStep(2), 1000); // Pindah ke refleksi setelah 1 detik
  };

  const handleFinishAll = () => {
    if(confirm('Terima kasih telah belajar! Kembali ke Halaman Utama?')) {
        // Opsional: Clear data session
        localStorage.removeItem('gi_chat_history'); 
        router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fdf9] font-sans pb-10">
      <nav className="bg-white px-6 py-4 shadow-sm flex items-center justify-center border-b border-emerald-100 sticky top-0 z-10">
        <h1 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
            <Award className="text-emerald-500" />
            Evaluasi & Refleksi Pembelajaran
        </h1>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        
        {/* STEP 1: KUIS INDIVIDU */}
        {activeStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100">
                    <div className="mb-6 border-b border-emerald-50 pb-4">
                        <h2 className="text-2xl font-bold text-emerald-900 mb-2">Kuis Pemahaman</h2>
                        <p className="text-slate-500 text-sm">Jawablah pertanyaan berikut secara mandiri untuk mengukur pemahamanmu.</p>
                    </div>

                    <form onSubmit={handleQuizSubmit} className="space-y-6">
                        {questions.map((q, idx) => (
                            <div key={q.id}>
                                <p className="font-semibold text-slate-800 mb-3">{idx + 1}. {q.q}</p>
                                <div className="space-y-2">
                                    {q.options.map((opt) => (
                                        <label key={opt} className={`flex items-center p-3 rounded-xl border cursor-pointer transition ${answers[q.id] === opt ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'border-slate-100 text-slate-700 hover:bg-slate-50'}`}>
                                            <input 
                                                type="radio" 
                                                name={`q-${q.id}`} 
                                                value={opt}
                                                onChange={() => setAnswers({...answers, [q.id]: opt})}
                                                required
                                                className="mr-3 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200/50 transition">
                            Kirim Jawaban
                        </button>
                    </form>
                </div>
            </div>
        )}

        {/* STEP 2: REFLEKSI & STUDI KASUS */}
        {activeStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                
                {/* Score Card */}
                <div className="bg-emerald-600 text-white p-6 rounded-2xl flex items-center justify-between shadow-lg">
                    <div>
                        <h3 className="text-xl font-bold">Hasil Kuis Kamu</h3>
                        <p className="text-emerald-100 text-sm">Luar biasa! Kamu telah menyelesaikan tahap evaluasi.</p>
                    </div>
                    <div className="text-4xl font-black bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                        {Math.round(quizScore || 0)}
                    </div>
                </div>

                {/* Studi Kasus & Refleksi */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2 text-emerald-800">
                            <BrainCircuit size={20}/>
                            <h3 className="font-bold text-lg">Studi Kasus (HOTS)</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            "Di sebuah desa, banyak warga terkena diare setelah banjir. Sebagai ahli biologi, tindakan preventif berbasis sains apa yang akan kamu sarankan?"
                        </p>
                        <textarea rows={3} className="w-full p-3 bg-slate-50 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 outline-none" placeholder="Tuliskan analisis dan solusimu..."></textarea>
                    </div>

                    <div className="mb-8">
                         <div className="flex items-center gap-2 mb-2 text-emerald-800">
                            <RotateCcw size={20}/>
                            <h3 className="font-bold text-lg">Refleksi Pembelajaran</h3>
                        </div>
                        <textarea rows={3} className="w-full p-3 bg-slate-50 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 outline-none" placeholder="Apa hal baru yang paling menarik kamu pelajari hari ini?"></textarea>
                    </div>

                    <button 
                        onClick={() => setActiveStep(3)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg transition"
                    >
                        Simpan Refleksi & Lihat Kesimpulan
                    </button>
                </div>
            </div>
        )}

        {/* STEP 3: KESIMPULAN & SELESAI */}
        {activeStep === 3 && (
            <div className="animate-in zoom-in duration-500 text-center space-y-8 pt-10">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-4 animate-bounce">
                    <CheckCircle size={48} />
                </div>
                
                <div>
                    <h2 className="text-3xl font-extrabold text-emerald-900 mb-2">Selamat, Investigasi Selesai!</h2>
                    <p className="text-slate-600 max-w-lg mx-auto">
                        Kalian telah berhasil melalui seluruh tahapan Group Investigation. Mulai dari identifikasi masalah hingga evaluasi.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 text-left max-w-2xl mx-auto">
                    <div className="flex items-center gap-2 mb-4 text-emerald-800 border-b border-emerald-50 pb-2">
                        <BookOpen size={20}/>
                        <h3 className="font-bold text-lg">Kesimpulan Materi (Take Home Message)</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-700">
                        <li className="flex gap-2"><span className="text-emerald-500">✔</span> Mikroorganisme memiliki peran ganda: patogen (penyakit) dan dekomposer/produsen (menguntungkan).</li>
                        <li className="flex gap-2"><span className="text-emerald-500">✔</span> Literasi sains membantu kita mengambil keputusan tepat terkait kesehatan dan kebersihan lingkungan.</li>
                        <li className="flex gap-2"><span className="text-emerald-500">✔</span> Investigasi kelompok melatih kemampuan berpikir kritis dan kolaborasi.</li>
                    </ul>
                </div>

                <button 
                    onClick={handleFinishAll}
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-full shadow-xl transition transform hover:-translate-y-1"
                >
                    <Home size={20} />
                    Kembali ke Beranda
                </button>
            </div>
        )}

      </main>
    </div>
  );
}