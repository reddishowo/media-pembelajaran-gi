'use client';

import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, Home, BrainCircuit, RotateCcw, BookOpen, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { saveEvaluation } from '../actions';

export default function EvaluasiPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Identitas
  const [sessionInfo, setSessionInfo] = useState({ groupName: '', userName: '' });

  // Form Refleksi
  const [evalData, setEvalData] = useState({ studiKasus: '', refleksi: '' });

  // Data Kuis Sederhana
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const questions = [
    { id: 1, q: "Apa perbedaan utama antara Virus dan Bakteri?", options: ["Virus memiliki sel, Bakteri tidak", "Bakteri dapat hidup mandiri, Virus butuh inang", "Keduanya memiliki inti sel"], correct: "Bakteri dapat hidup mandiri, Virus butuh inang" },
    { id: 2, q: "Manakah peran jamur Rhizopus sp. yang menguntungkan?", options: ["Pembuatan tempe", "Penghasil antibiotik", "Pembusukan buah"], correct: "Pembuatan tempe" },
    { id: 3, q: "Dalam metode ilmiah, apa langkah setelah merumuskan masalah?", options: ["Menarik kesimpulan", "Menyusun hipotesis", "Melakukan eksperimen"], correct: "Menyusun hipotesis" },
  ];

  useEffect(() => {
      const session = localStorage.getItem('gi_session');
      if(session) {
          const parsed = JSON.parse(session);
          setSessionInfo({ groupName: parsed.groupName, userName: parsed.members[0] || 'Peserta' });
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
      
      // Kirim Data Evaluasi Individu ke MongoDB Server Action
      await saveEvaluation(sessionInfo.groupName, sessionInfo.userName, {
          quizScore: quizScore,
          studiKasus: evalData.studiKasus,
          refleksi: evalData.refleksi,
          answers: answers // simpan juga pilihan jawabannya jika perlu
      });
      
      setIsSaving(false);
      setActiveStep(3);
  };

  const handleFinishAll = () => {
    localStorage.removeItem('gi_session'); 
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#f7fdf9] font-sans pb-10">
      <nav className="bg-white px-6 py-4 shadow-sm flex items-center justify-center border-b border-emerald-100 sticky top-0 z-10">
        <h1 className="font-bold text-emerald-900 text-lg flex items-center gap-2"><Award className="text-emerald-500" />Evaluasi & Refleksi Pembelajaran</h1>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {activeStep === 1 && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100">
                <div className="mb-6 border-b border-emerald-50 pb-4"><h2 className="text-2xl font-bold text-emerald-900 mb-2">Kuis Pemahaman</h2><p className="text-slate-500 text-sm">Peserta: {sessionInfo.userName} ({sessionInfo.groupName})</p></div>
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
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg transition">Kirim Jawaban</button>
                </form>
            </div>
        )}

        {activeStep === 2 && (
            <div className="space-y-6">
                <div className="bg-emerald-600 text-white p-6 rounded-2xl flex items-center justify-between shadow-lg">
                    <div><h3 className="text-xl font-bold">Hasil Kuis Kamu</h3><p className="text-emerald-100 text-sm">Nilai akan disimpan ke Database Guru.</p></div>
                    <div className="text-4xl font-black bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">{Math.round(quizScore || 0)}</div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2 text-emerald-800"><BrainCircuit size={20}/><h3 className="font-bold text-lg">Studi Kasus (HOTS)</h3></div>
                        <p className="text-sm text-slate-600 mb-3 bg-slate-50 p-3 rounded-lg border border-slate-100">"Di sebuah desa, banyak warga terkena diare setelah banjir. Tindakan preventif berbasis sains apa yang kamu sarankan?"</p>
                        <textarea rows={3} value={evalData.studiKasus} onChange={e => setEvalData({...evalData, studiKasus: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-emerald-200 text-slate-800 focus:ring-2 focus:ring-emerald-400 outline-none" placeholder="Tuliskan analisis..."></textarea>
                    </div>

                    <div className="mb-8">
                         <div className="flex items-center gap-2 mb-2 text-emerald-800"><RotateCcw size={20}/><h3 className="font-bold text-lg">Refleksi Pembelajaran</h3></div>
                        <textarea rows={3} value={evalData.refleksi} onChange={e => setEvalData({...evalData, refleksi: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-emerald-200 text-slate-800 focus:ring-2 focus:ring-emerald-400 outline-none" placeholder="Apa hal baru yang kamu pelajari?"></textarea>
                    </div>

                    <button onClick={handleSaveEvaluasi} disabled={isSaving} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg flex justify-center items-center gap-2">
                        {isSaving ? <Loader2 className="animate-spin" size={20}/> : "Simpan Penilaian ke Database"}
                    </button>
                </div>
            </div>
        )}

        {activeStep === 3 && (
            <div className="text-center space-y-8 pt-10">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-4 animate-bounce"><CheckCircle size={48} /></div>
                <div><h2 className="text-3xl font-extrabold text-emerald-900 mb-2">Evaluasi Terekam di Database!</h2><p className="text-slate-600">Seluruh data kelompok dan evaluasi individu kamu telah berhasil masuk ke server sekolah.</p></div>
                <button onClick={handleFinishAll} className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-full shadow-xl transition transform hover:-translate-y-1"><Home size={20} />Kembali ke Beranda</button>
            </div>
        )}
      </main>
    </div>
  );
}