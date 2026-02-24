'use client';

import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Target, Calendar, Save, Plus, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function GroupFormation() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State untuk loading

  const [groupData, setGroupData] = useState({
    groupName: '',
    members: ['', '', '', ''],
    topic: '',
    problemStatement: ''
  });

  const topics = [
    { id: 'virus', title: 'Struktur & Ciri Virus', desc: 'Analisis bentuk, ukuran, dan sifat parasit virus.' },
    { id: 'bakteri', title: 'Reproduksi Bakteri', desc: 'Investigasi pembelahan biner dan pertukaran materi genetik.' },
    { id: 'jamur', title: 'Klasifikasi Jamur', desc: 'Identifikasi Zygomycota, Ascomycota, dan peranannya.' }
  ];

  useEffect(() => {
    setIsClient(true);
    const savedData = localStorage.getItem('gi_group_data');
    if (savedData) {
      setGroupData(JSON.parse(savedData));
    }
  }, []);

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...groupData.members];
    newMembers[index] = value;
    setGroupData({ ...groupData, members: newMembers });
  };

  const addMember = () => setGroupData({ ...groupData, members: [...groupData.members, ''] });
  
  const removeMember = (index: number) => {
    const newMembers = groupData.members.filter((_, i) => i !== index);
    setGroupData({ ...groupData, members: newMembers });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupData.topic) {
        alert('Mohon pilih topik investigasi terlebih dahulu!');
        return;
    }

    setIsLoading(true); // Mulai loading
    localStorage.setItem('gi_group_data', JSON.stringify(groupData));
    
    // Simulasi delay sedikit agar user sadar data tersimpan, lalu pindah halaman
    setTimeout(() => {
        router.push('/materi'); // PINDAH KE HALAMAN MATERI
    }, 1500);
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#f7fdf9] text-slate-800 font-sans pb-20">
      <nav className="bg-white border-b border-emerald-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
        <Link href="/" className="p-2 hover:bg-emerald-50 rounded-full text-emerald-600 transition">
            <ArrowLeft size={20} />
        </Link>
        <div>
            <h1 className="font-bold text-emerald-900 text-lg">Fase 1: Identifikasi & Organisasi</h1>
            <p className="text-xs text-slate-500">Langkah 1 dari 3</p>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <section className="bg-emerald-600 text-white p-6 rounded-2xl mb-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold mb-2">Mari Berkelompok!</h2>
                <p className="text-emerald-50 text-sm leading-relaxed">
                    Silakan isi identitas tim dan pilih topik. Data ini akan otomatis digunakan pada halaman LKPD dan Chat Diskusi nanti.
                </p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSave} className="space-y-8">
            {/* Bagian Form (Sama seperti sebelumnya) */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <div className="flex items-center gap-2 mb-6 text-emerald-800 border-b border-emerald-50 pb-2">
                    <Users size={20} />
                    <h3 className="font-bold text-lg">Identitas Kelompok</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kelompok</label>
                        <input 
                            type="text" 
                            placeholder="Contoh: Kelompok Bakteriophaga"
                            className="w-full p-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:outline-none bg-emerald-50/30"
                            value={groupData.groupName}
                            onChange={(e) => setGroupData({...groupData, groupName: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Anggota Peneliti</label>
                        <div className="space-y-3">
                            {groupData.members.map((member, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder={`Nama Anggota ${idx + 1}`}
                                        className="w-full p-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                        value={member}
                                        onChange={(e) => handleMemberChange(idx, e.target.value)}
                                        required
                                    />
                                    {groupData.members.length > 2 && (
                                        <button type="button" onClick={() => removeMember(idx)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition">
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addMember} className="mt-3 text-sm text-emerald-600 font-medium flex items-center gap-1 hover:underline">
                            <Plus size={16} /> Tambah Anggota
                        </button>
                    </div>
                </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <div className="flex items-center gap-2 mb-6 text-emerald-800 border-b border-emerald-50 pb-2">
                    <BookOpen size={20} />
                    <h3 className="font-bold text-lg">Pilih Topik Investigasi</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    {topics.map((t) => (
                        <label key={t.id} className={`cursor-pointer relative p-4 rounded-xl border-2 transition-all ${groupData.topic === t.id ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'}`}>
                            <input type="radio" name="topic" value={t.id} className="absolute opacity-0" onChange={(e) => setGroupData({...groupData, topic: e.target.value})} checked={groupData.topic === t.id} />
                            <div className="font-bold text-emerald-900 mb-1">{t.title}</div>
                            <div className="text-xs text-slate-500 leading-snug">{t.desc}</div>
                            {groupData.topic === t.id && <div className="absolute top-2 right-2 text-emerald-500"><Target size={16} /></div>}
                        </label>
                    ))}
                </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <div className="flex items-center gap-2 mb-4 text-emerald-800 border-b border-emerald-50 pb-2">
                    <Target size={20} />
                    <h3 className="font-bold text-lg">Rumusan Masalah</h3>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg mb-4 text-sm text-blue-800 border border-blue-100">
                    <strong>Tips Literasi Sains:</strong> Buatlah pertanyaan investigasi yang spesifik. <br/><em>Contoh: "Bagaimana pengaruh suhu terhadap kecepatan reproduksi bakteri E. coli?"</em>
                </div>
                <textarea rows={4} className="w-full p-4 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 focus:outline-none" placeholder="Tuliskan pertanyaan utama..." value={groupData.problemStatement} onChange={(e) => setGroupData({...groupData, problemStatement: e.target.value})} required></textarea>
            </section>

            {/* Action Button Fixed Bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-emerald-100 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-30">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="hidden md:block text-xs text-slate-500">
                        Pastikan semua data terisi sebelum lanjut.
                    </div>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-emerald-200/50 flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Simpan & Lanjut Materi
                            </>
                        )}
                    </button>
                </div>
            </div>

        </form>
      </main>
    </div>
  );
}