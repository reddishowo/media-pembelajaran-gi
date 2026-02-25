'use client';

import React, { useState } from 'react';
import { Users, UserPlus, LogIn, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createGroup, joinGroup } from '../actions';

export default function GroupFormation() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('join');
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    groupName: '',
    userName: '', 
    groupCode: '',
    topic: ''
  });

  const topics = [
    { id: 'virus', title: 'Virus', desc: 'Struktur & Ciri' },
    { id: 'bakteri', title: 'Bakteri', desc: 'Reproduksi & Peran' },
    { id: 'jamur', title: 'Jamur', desc: 'Klasifikasi & Fermentasi' }
  ];

  // Handler: BUAT KELOMPOK
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.topic) return alert("Pilih topik dulu!");
    
    setIsLoading(true);
    const res = await createGroup(formData.groupName, formData.userName, formData.topic);
    
    if (res.success) {
      const sessionData = {
        groupName: res.groupName,
        groupCode: res.groupCode,
        userName: formData.userName,
        topic: formData.topic,
        role: 'leader'
      };
      localStorage.setItem('gi_session', JSON.stringify(sessionData));
      
      alert(`Kelompok Berhasil Dibuat!\nKode Unik: ${res.groupCode}\nBagikan kode ini ke temanmu.`);
      router.push('/materi');
    } else {
      alert("Gagal membuat kelompok: " + res.error);
    }
    setIsLoading(false);
  };

  // Handler: GABUNG KELOMPOK
  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await joinGroup(formData.groupCode.toUpperCase(), formData.userName);

    if (res.success) {
      const sessionData = {
        groupName: res.groupName,
        groupCode: formData.groupCode.toUpperCase(),
        userName: formData.userName,
        topic: res.topic, 
        role: 'member'
      };
      localStorage.setItem('gi_session', JSON.stringify(sessionData));
      
      router.push('/materi');
    } else {
      alert("Gagal bergabung: " + res.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f7fdf9] font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
        
        {/* Header Tabs */}
        <div className="flex border-b border-emerald-100">
          <button 
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === 'join' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LogIn size={18}/> Gabung Kelompok
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === 'create' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <UserPlus size={18}/> Buat Baru
          </button>
        </div>

        <div className="p-8">
          {/* --- FORM GABUNG --- */}
          {activeTab === 'join' && (
            <form onSubmit={handleJoin} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-emerald-900">Masuk ke Tim</h2>
                <p className="text-sm text-slate-500">Masukkan kode yang diberikan ketua kelompokmu.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Kamu</label>
                {/* PERBAIKAN WARNA TEKS DISINI */}
                <input 
                  type="text" required 
                  className="w-full p-3 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 outline-none"
                  placeholder="Nama Lengkap"
                  value={formData.userName}
                  onChange={e => setFormData({...formData, userName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kode Kelompok</label>
                {/* PERBAIKAN WARNA TEKS DISINI */}
                <input 
                  type="text" required maxLength={6}
                  className="w-full p-3 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-emerald-400 outline-none text-center text-2xl font-mono tracking-widest uppercase placeholder:text-slate-300"
                  placeholder="X7Y9Z1"
                  value={formData.groupCode}
                  onChange={e => setFormData({...formData, groupCode: e.target.value})}
                />
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition transform active:scale-95">
                {isLoading ? <Loader2 className="animate-spin"/> : <ArrowRight/>} Gabung Sekarang
              </button>
            </form>
          )}

          {/* --- FORM BUAT BARU --- */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreate} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-emerald-900">Bentuk Tim Baru</h2>
                <p className="text-xs text-slate-500">Kamu akan menjadi ketua kelompok.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Kelompok</label>
                {/* PERBAIKAN WARNA TEKS DISINI */}
                <input 
                  type="text" required 
                  className="w-full p-3 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 outline-none"
                  placeholder="Contoh: Tim Bakteriophaga"
                  value={formData.groupName}
                  onChange={e => setFormData({...formData, groupName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Ketua (Kamu)</label>
                {/* PERBAIKAN WARNA TEKS DISINI */}
                <input 
                  type="text" required 
                  className="w-full p-3 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 outline-none"
                  placeholder="Nama Lengkap"
                  value={formData.userName}
                  onChange={e => setFormData({...formData, userName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pilih Topik</label>
                <div className="grid grid-cols-3 gap-2">
                  {topics.map(t => (
                    <div 
                      key={t.id}
                      onClick={() => setFormData({...formData, topic: t.id})}
                      className={`cursor-pointer p-2 rounded-lg border text-center transition ${formData.topic === t.id ? 'bg-emerald-100 border-emerald-500 ring-1 ring-emerald-500' : 'bg-slate-50 border-slate-200 hover:border-emerald-300'}`}
                    >
                      <div className="text-xs font-bold text-emerald-900">{t.title}</div>
                      <div className="text-[10px] text-slate-500 leading-tight mt-1">{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition transform active:scale-95">
                {isLoading ? <Loader2 className="animate-spin"/> : <UserPlus size={18}/>} Buat Kelompok
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}