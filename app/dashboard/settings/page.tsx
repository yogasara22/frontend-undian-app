'use client';

import { useState, useEffect } from 'react';
import { getBackgroundConfig, saveBackgroundConfig, type GradientEntry, type BackgroundConfig, type TypographyConfig, type ScheduledWinner } from '../../lib/settings';
import { dummyPrizes } from '../../lib/dummy';

const FONTS = [
  { name: 'Inter (Sans)', value: 'var(--font-inter)' },
  { name: 'Montserrat (Modern)', value: 'var(--font-montserrat)' },
  { name: 'Poppins (Soft)', value: 'var(--font-poppins)' },
  { name: 'Bebas Neue (Display)', value: 'var(--font-bebas)' },
];

const FONT_WEIGHTS = [
  { name: 'Regular', value: '400' },
  { name: 'Semi Bold', value: '600' },
  { name: 'Bold', value: '700' },
  { name: 'Black', value: '900' },
];

export default function SettingsPage() {
  const [config, setConfig] = useState<BackgroundConfig | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [newWinner, setNewWinner] = useState({ name: '', nik: '', prizeId: '' });

  useEffect(() => {
    setConfig(getBackgroundConfig());
  }, []);

  if (!config) return null;

  const handleSave = () => {
    if (config) {
      saveBackgroundConfig(config);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const addScheduledWinner = () => {
    if (!newWinner.name || !newWinner.nik || !newWinner.prizeId) {
      alert('Harap isi Nama, NIK, dan Pilih Hadiah');
      return;
    }
    
    const selectedPrize = dummyPrizes.find(p => p.id.toString() === newWinner.prizeId);
    if (!selectedPrize) return;

    const winner: ScheduledWinner = {
      id: Math.random().toString(36).substring(2, 9),
      name: newWinner.name,
      nik: newWinner.nik,
      prizeId: selectedPrize.id,
      prizeName: selectedPrize.name,
      department: 'Priority Customer', // Default value
      shopName: 'VIP Transaction'     // Default value
    };

    const newConfig = {
      ...config,
      scheduledWinners: [...(config.scheduledWinners || []), winner]
    };
    
    setConfig(newConfig);
    saveBackgroundConfig(newConfig); // Auto Save
    setNewWinner({ name: '', nik: '', prizeId: '' });
  };

  const removeScheduledWinner = (id: string) => {
    const newConfig = {
      ...config,
      scheduledWinners: config.scheduledWinners.filter(w => w.id !== id)
    };
    setConfig(newConfig);
    saveBackgroundConfig(newConfig); // Auto Save
  };

  const handleDurationChange = (val: string) => {
    const num = parseInt(val) || 0;
    setConfig({ ...config, duration: num * 1000 });
  };

  const updateGradient = (index: number, field: keyof GradientEntry, value: string) => {
    const newGradients = [...config.gradients];
    newGradients[index] = { ...newGradients[index], [field]: value };
    setConfig({ ...config, gradients: newGradients });
  };

  const addGradient = () => {
    setConfig({
      ...config,
      gradients: [...config.gradients, { from: '#3b82f6', via: '#2563eb', to: '#1d4ed8' }]
    });
  };

  const removeGradient = (index: number) => {
    if (config.gradients.length <= 1) return;
    const newGradients = config.gradients.filter((_, i) => i !== index);
    setConfig({ ...config, gradients: newGradients });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file terlalu besar (Maksimal 2MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig({ ...config, backgroundImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateTitleStyle = (key: keyof TypographyConfig, value: any) => {
    setConfig({
      ...config,
      titleStyle: { ...config.titleStyle, [key]: value }
    });
  };

  const updatePrizeStyle = (key: keyof TypographyConfig, value: any) => {
    setConfig({
      ...config,
      prizeStyle: { ...config.prizeStyle, [key]: value }
    });
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Konfigurasi Desain</h2>
          <p className="text-gray-500 text-sm">Sesuaikan tampilan layar undian agar lebih premium</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 ${
            isSaved ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-black hover:scale-105 active:scale-95'
          }`}
        >
          {isSaved ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              Tersimpan!
            </>
          ) : (
            'Simpan Konfigurasi'
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Waktu Rotasi
            </h3>
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Interval Transisi</label>
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{config.duration / 1000} Detik</span>
              </div>
              <input
                type="range"
                min="5000"
                max="300000"
                step="5000"
                value={config.duration}
                onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-hidden relative">
             <h3 className="text-gray-900 font-bold mb-4">Preview Atas</h3>
             <div 
               className="w-full h-48 md:h-56 rounded-xl shadow-inner flex items-center justify-center text-center p-4 relative overflow-hidden"
               style={{
                 background: config.useImageBackground && config.backgroundImage
                   ? `url(${config.backgroundImage}) center/cover no-repeat`
                   : `linear-gradient(135deg, ${config.gradients[0]?.from}, ${config.gradients[0]?.via}, ${config.gradients[0]?.to})`
               }}
             >
                <div className="relative z-10 drop-shadow-lg">
                  <div 
                    className="uppercase tracking-widest mb-1"
                    style={{
                      fontFamily: config.titleStyle.fontFamily,
                      fontSize: `${Math.max(10, config.titleStyle.fontSize / 3.5)}px`,
                      color: config.titleStyle.color,
                      fontWeight: config.titleStyle.fontWeight,
                      letterSpacing: `${config.titleStyle.letterSpacing / 3}px`,
                      textShadow: config.titleStyle.textShadow ? '0 2px 4px rgba(0,0,0,0.5)' : 'none'
                    }}
                  >
                    {config.customTitle || 'UNDIAN BERHADIAH'}
                  </div>
                  <div 
                    className="uppercase leading-none"
                    style={{
                      fontFamily: config.prizeStyle.fontFamily,
                      fontSize: `${Math.max(14, config.prizeStyle.fontSize / 3.5)}px`,
                      color: config.prizeStyle.color,
                      fontWeight: config.prizeStyle.fontWeight,
                      letterSpacing: `${config.prizeStyle.letterSpacing / 3}px`,
                      textShadow: config.prizeStyle.textShadow ? '0 4px 8px rgba(0,0,0,0.5)' : 'none'
                    }}
                  >
                    HADIAH UTAMA
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 z-0" />
             </div>
             <p className="mt-3 text-[10px] text-gray-400 text-center uppercase font-bold tracking-widest">Preview Tampilan Layar Undian</p>
          </section>
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </span>
              Mode Tampilan
            </h3>
            <div className="space-y-4">
              <div className="flex p-1 bg-gray-100 rounded-xl">
                <button
                  onClick={() => setConfig({ ...config, useImageBackground: false })}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!config.useImageBackground ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Warna Gradient
                </button>
                <button
                  onClick={() => setConfig({ ...config, useImageBackground: true })}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${config.useImageBackground ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Custom Image
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Isi Judul Hadiah</label>
                <input
                  type="text"
                  value={config.customTitle}
                  onChange={(e) => setConfig({ ...config, customTitle: e.target.value })}
                  placeholder="Contoh: UNDIAN BERHADIAH MINGGUAN"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-bold text-gray-800 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-8">
            <h3 className="text-gray-900 font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </span>
              Desain Teks
            </h3>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Gaya Judul Atas</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Font Family</label>
                  <select 
                    value={config.titleStyle.fontFamily}
                    onChange={(e) => updateTitleStyle('fontFamily', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500"
                  >
                    {FONTS.map((f) => <option key={f.value} value={f.value}>{f.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Warna Teks</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={config.titleStyle.color} onChange={(e) => updateTitleStyle('color', e.target.value)} className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer" />
                    <input type="text" value={config.titleStyle.color} onChange={(e) => updateTitleStyle('color', e.target.value)} className="flex-1 min-w-0 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-mono uppercase" />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Ukuran Font</label>
                  <span className="text-[10px] font-black text-blue-600">{config.titleStyle.fontSize}px</span>
                </div>
                <input type="range" min="12" max="64" step="1" value={config.titleStyle.fontSize} onChange={(e) => updateTitleStyle('fontSize', parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Gaya Nama Hadiah Utama</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Font Family</label>
                  <select 
                    value={config.prizeStyle.fontFamily}
                    onChange={(e) => updatePrizeStyle('fontFamily', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500"
                  >
                    {FONTS.map((f) => <option key={f.value} value={f.value}>{f.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Warna Teks</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={config.prizeStyle.color} onChange={(e) => updatePrizeStyle('color', e.target.value)} className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer" />
                    <input type="text" value={config.prizeStyle.color} onChange={(e) => updatePrizeStyle('color', e.target.value)} className="flex-1 min-w-0 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-mono uppercase" />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Ukuran Font</label>
                  <span className="text-[10px] font-black text-blue-600">{config.prizeStyle.fontSize}px</span>
                </div>
                <input type="range" min="32" max="160" step="2" value={config.prizeStyle.fontSize} onChange={(e) => updatePrizeStyle('fontSize', parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-2">
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                {config.useImageBackground ? 'Konfigurasi Background Gambar' : 'Koleksi Pallet Warna (Gradients)'}
              </h3>
              {!config.useImageBackground && (
                <button
                  onClick={addGradient}
                  className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Gradient
                </button>
              )}
            </div>

            {config.useImageBackground ? (
              <div className="space-y-6">
                <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50/50 hover:bg-white hover:border-blue-300 transition-all group min-h-[300px] relative">
                   {config.backgroundImage ? (
                     <div className="relative w-full h-[250px] md:h-[400px] rounded-xl overflow-hidden shadow-lg mb-4">
                        <img src={config.backgroundImage} className="w-full h-full object-cover" alt="Background Preview" />
                        <button 
                          onClick={() => setConfig({ ...config, backgroundImage: '' })}
                          className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-10"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                     </div>
                   ) : (
                     <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 group-hover:text-blue-500 transition-colors shadow-inner">
                           <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                           </svg>
                        </div>
                        <p className="text-base font-bold text-gray-600">Pilih atau Seret Gambar ke Sini</p>
                        <p className="text-sm text-gray-400 mt-2">Format: JPG, PNG, WebP (Rasio 16:9 disarankan)</p>
                     </div>
                   )}
                   <input
                     type="file"
                     accept="image/*"
                     onChange={handleImageUpload}
                     className="absolute inset-0 opacity-0 cursor-pointer z-0"
                     title=""
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Atau Gunakan URL Gambar</label>
                      <input
                        type="text"
                        value={config.backgroundImage.startsWith('data:') ? '' : config.backgroundImage}
                        onChange={(e) => setConfig({ ...config, backgroundImage: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                        placeholder="https://example.com/bg-undian.jpg"
                      />
                   </div>
                   <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-start gap-3">
                      <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-[11px] text-orange-700 font-medium leading-relaxed">
                        Jika menggunakan file lokal (Base64), pastikan ukurannya di bawah 2MB agar aplikasi tetap lancar.
                      </p>
                   </div>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
              {config.gradients.map((grad, idx) => (
                <div 
                  key={idx} 
                  className="group relative bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-4 md:gap-6 transition-all hover:bg-white hover:shadow-md hover:border-blue-200"
                >
                  <div className="flex-shrink-0 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-black text-gray-400">
                      #{idx + 1}
                    </div>
                    <div 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-md border-2 border-white ring-1 ring-gray-200"
                      style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.via}, ${grad.to})` }}
                    />
                  </div>

                  <div className="flex-1 grid grid-cols-3 gap-2 md:gap-4 w-full">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">From</label>
                      <div className="flex items-center gap-2">
                         <input
                          type="color"
                          value={grad.from}
                          onChange={(e) => updateGradient(idx, 'from', e.target.value)}
                          className="w-8 h-8 rounded-md cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={grad.from}
                          onChange={(e) => updateGradient(idx, 'from', e.target.value)}
                          className="flex-1 min-w-0 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-700 focus:ring-1 focus:ring-blue-500 uppercase"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Via</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={grad.via}
                          onChange={(e) => updateGradient(idx, 'via', e.target.value)}
                          className="w-8 h-8 rounded-md cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={grad.via}
                          onChange={(e) => updateGradient(idx, 'via', e.target.value)}
                          className="flex-1 min-w-0 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-700 focus:ring-1 focus:ring-blue-500 uppercase"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">To</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={grad.to}
                          onChange={(e) => updateGradient(idx, 'to', e.target.value)}
                          className="w-8 h-8 rounded-md cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={grad.to}
                          onChange={(e) => updateGradient(idx, 'to', e.target.value)}
                          className="flex-1 min-w-0 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-700 focus:ring-1 focus:ring-blue-500 uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeGradient(idx)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors md:self-center"
                    title="Hapus Gradient"
                    disabled={config.gradients.length <= 1}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3 italic">
              <span className="text-blue-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </span>
              <p className="text-xs text-blue-700 font-medium leading-relaxed">
                {config.useImageBackground 
                  ? "Mode gambar aktif. Gunakan gambar dengan resolusi tinggi (FHD) untuk hasil visual terbaik di layar panggung."
                  : "Background akan berotasi secara berurutan sesuai daftar di atas. Gunakan kombinasi warna yang kontras dengan teks putih layar undian untuk keterbacaan maksimal."}
              </p>
            </div>
          </>
        )}
      </section>

          {/* NEW SECTION: Scheduled Winner Management */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-8">
            <h3 className="text-gray-900 font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
              Pengaturan Pemenang Terpadu (Manipulasi)
            </h3>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-8">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Input Pemenang Tertentu</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={newWinner.name}
                    onChange={(e) => setNewWinner({ ...newWinner, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 transition-all font-bold"
                    placeholder="Contoh: Ahmad"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">NIK (KTP)</label>
                  <input 
                    type="text" 
                    value={newWinner.nik}
                    onChange={(e) => setNewWinner({ ...newWinner, nik: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 transition-all font-bold"
                    placeholder="Input NIK"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Hadiah yg Didapat</label>
                  <select 
                    value={newWinner.prizeId}
                    onChange={(e) => setNewWinner({ ...newWinner, prizeId: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 transition-all font-bold"
                  >
                    <option value="">Pilih Hadiah</option>
                    {dummyPrizes.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button 
                onClick={addScheduledWinner}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                Tambahkan ke Daftar Pemenang
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama</th>
                    <th className="text-left py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">NIK</th>
                    <th className="text-left py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hadiah</th>
                    <th className="text-center py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {config.scheduledWinners && config.scheduledWinners.length > 0 ? config.scheduledWinners.map(w => (
                    <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-bold text-gray-800">{w.name}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-500">{w.nik}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wide border border-blue-100">
                          {w.prizeName}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button 
                          onClick={() => removeScheduledWinner(w.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                          title="Hapus"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-400 text-xs italic font-medium">Beri kejutan! Belum ada pemenang yang terjadwal.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-6 p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex gap-3">
              <svg className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-[10px] text-yellow-700 font-bold leading-relaxed uppercase tracking-tight">
                Peringatan: Pemenang akan otomatis dihapus dari daftar ini setelah berhasil menang untuk mencegah kemenangan berulang.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
