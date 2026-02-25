'use client';

import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, Home, BrainCircuit, RotateCcw, BookOpen, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
// Ganti import action ke yang baru
import { saveIndividualEvaluation } from '../actions';

export default function EvaluasiPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Identitas (Ambil dari Sesi Login via Kode tadi)
  const [sessionInfo, setSessionInfo] = useState({ groupName: '', userName: '', role: '' });

  const [evalData, setEvalData] = useState({ studiKasus: '', refleksi: '' });
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const questions = [
    { id: 1, q: "Apa perbedaan utama antara Virus dan Bakteri?", options: ["Virus memiliki sel, Bakteri tidak", "Bakteri dapat hidup mandiri, Virus butuh inang", "Keduanya memiliki inti sel"], correct: "Bakteri dapat hidup mandiri, Virus butuh inang" },
    { id: 2, q: "Manakah peran jamur Rhizopus sp. yang menguntungkan?", options: ["Pembuatan tempe", "Penghasil antibiotik", "Pembusukan buah"], correct: "Pembuatan tempe" },
    { id: 3, q: "Dalam metode ilmiah, apa langkah setelah merumuskan masalah?", options: ["Menarik kesimpulan", "Menyusun hipotesis", "Melakukan eksperimen"], correct: "Menyusun hipotesis" },
  ];

  useEffect(() => {
      // Ambil data sesi yang disimpan saat login kode
      const session = localStorage.getItem('gi_session');
      if(session) {
          const parsed = JSON.parse(session);
          setSessionInfo({ 
            groupName: parsed.groupName, 
            userName: parsed.userName, // Ini nama individu yang login
            role: parsed.role 
          });
      }
  }, []);

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    questions.forEach(q => { if(answers[q.id] === q.correct) score += 1; });
    setQuizScore((score / questions.length) * 100);
    setActiveStep(2);
  };

  const handleSaveEvaluasi = async () => {
      setIsSaving(true);
      
      // Simpan data spesifik milik user ini
      await saveIndividualEvaluation(sessionInfo.groupName, sessionInfo.userName, {
          role: sessionInfo.role, // Simpan juga dia ketua/anggota
          quizScore: quizScore,
          studiKasus: evalData.studiKasus,
          refleksi: evalData.refleksi,
          answers: answers
      });
      
      setIsSaving(false);
      setActiveStep(3);
  };

  const handleFinishAll = () => {
    localStorage.removeItem('gi_session'); // Logout
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#f7fdf9] font-sans pb-10">
      <nav className="bg-white px-6 py-4 shadow-sm flex items-center justify-center border-b border-emerald-100 sticky top-0 z-10">
        <h1 className="font-bold text-emerald-900 text-lg flex items-center gap-2"><Award className="text-emerald-500" />Evaluasi & Refleksi Pembelajaran</h1>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Tampilan Sapaan Personal */}
        <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
            <p className="text-emerald-800 text-sm">
                Halo, <strong>{sessionInfo.userName}</strong>! <br/>
                Silakan kerjakan evaluasi ini secara mandiri (Individu).
            </p>
        </div>

        {activeStep === 1 && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100">
                <div className="mb-6 border-b border-emerald-50 pb-4"><h2 className="text-2xl font-bold text-emerald-900 mb-2">Kuis Pemahaman</h2><p className="text-slate-500 text-sm">Jawab dengan jujur.</p></div>
                <form onSubmit={handleQuizSubmit} className="space-y-6">
                    {questions.map((q, idx) => (
                        <div key={q.id}>
                            <p className="font-semibold text-slate-800 mb-3">{idx + 1}. {q.q}</p>
                            <div className="space-y-2">
                                {q.options.map((opt) => (
                                    <label key={opt} className={`flex items-center p-3 rounded-xl border cursor-pointer transition ${answers[q.id] === opt ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                                        <input type="radio" name={`q-${q.id}`} value={opt} onChange={() => setAnswers({...answers, [q.id]: opt})} required className="mr-3 text-emerald-600 focus:ring-emerald-500"/>
                                        <span className="text-sm">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg transition">Lanjut Refleksi</button>
                </form>
            </div>
        )}

        {activeStep === 2 && (
            <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2 text-emerald-800"><BrainCircuit size={20}/><h3 className="font-bold text-lg">Studi Kasus (Individu)</h3></div>
                        <p className="text-sm text-slate-600 mb-3 bg-slate-50 p-3 rounded-lg border border-slate-100">"Menurut pendapatmu pribadi, bagaimana cara paling efektif mencegah penyebaran virus di lingkungan sekolah?"</p>
                        <textarea rows={3} value={evalData.studiKasus} onChange={e => setEvalData({...evalData, studiKasus: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-emerald-200 text-slate-800 focus:ring-2 focus:ring-emerald-400 outline-none" placeholder="Tuliskan analisismu..."></textarea>
                    </div>

                    <div className="mb-8">
                         <div className="flex items-center gap-2 mb-2 text-emerald-800"><RotateCcw size={20}/><h3 className="font-bold text-lg">Refleksi Diri</h3></div>
                        <textarea rows={3} value={evalData.refleksi} onChange={e => setEvalData({...evalData, refleksi: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-emerald-200 text-slate-800 focus:ring-2 focus:ring-emerald-400 outline-none" placeholder="Bagaimana kontribusimu dalam kelompok tadi?"></textarea>
                    </div>

                    <button onClick={handleSaveEvaluasi} disabled={isSaving} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg flex justify-center items-center gap-2">
                        {isSaving ? <Loader2 className="animate-spin" size={20}/> : "Kirim Jawaban Saya"}
                    </button>
                </div>
            </div>
        )}

        {activeStep === 3 && (
            <div className="text-center space-y-8 pt-10">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-4 animate-bounce"><CheckCircle size={48} /></div>
                <div>
                    <h2 className="text-3xl font-extrabold text-emerald-900 mb-2">Terima Kasih, {sessionInfo.userName}!</h2>
                    <p className="text-slate-600">Nilai kuis: <span className="font-bold text-emerald-600">{Math.round(quizScore || 0)}</span>. Jawaban refleksimu telah tersimpan.</p>
                </div>
                <button onClick={handleFinishAll} className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-full shadow-xl transition transform hover:-translate-y-1"><Home size={20} />Kembali ke Beranda</button>
            </div>
        )}
      </main>
    </div>
  );
}