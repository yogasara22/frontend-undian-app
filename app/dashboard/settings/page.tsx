'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchAPI } from '../../lib/api';
import { getBackgroundConfig, saveBackgroundConfig, type GradientEntry, type BackgroundConfig, type TypographyConfig, type ScheduledWinner } from '../../lib/settings';

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
  const [prizes, setPrizes] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [newWinner, setNewWinner] = useState({ name: '', nik: '', prizeId: '' });
  
  const [participants, setParticipants] = useState<any[]>([]);
  const [participantSearch, setParticipantSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAddingWinner, setIsAddingWinner] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    const handler = setTimeout(async () => {
      // Hanya cari jika panjang >= 2 dan belum ada peserta yang dipilih valid (newWinner.nik)
      if (participantSearch.length >= 2 && !newWinner.nik) {
        setIsSearching(true);
        try {
          const res = await fetchAPI(`/api/participants?search=${participantSearch}&per_page=10`);
          setParticipants(res?.data || []);
          setShowDropdown(true);
        } catch (e) {
          console.error('Failed to search participants', e);
        } finally {
          setIsSearching(false);
        }
      } else if (!newWinner.nik) {
        setParticipants([]);
        setShowDropdown(false);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [participantSearch, newWinner.nik]);

  const fetchSettings = async () => {
    try {
      const [settingsRes, scheduledRes, prizesRes] = await Promise.all([
        fetchAPI('/api/settings'),
        fetchAPI('/api/scheduled-winners'),
        fetchAPI('/api/prizes')
      ]);

      const defaults = getBackgroundConfig();
      const currentLocal = getBackgroundConfig(); // get current local state before overwriting
      const appAppearance = settingsRes?.data?.app_appearance || {};
      
      const newConfig: BackgroundConfig = {
        ...defaults,
        ...currentLocal, // prioritize local if server is missing keys
        ...appAppearance,
        titleStyle: appAppearance.titleStyle ? { ...defaults.titleStyle, ...appAppearance.titleStyle } : (currentLocal.titleStyle || defaults.titleStyle),
        prizeStyle: appAppearance.prizeStyle ? { ...defaults.prizeStyle, ...appAppearance.prizeStyle } : (currentLocal.prizeStyle || defaults.prizeStyle),
        scheduledWinners: scheduledRes?.data || []
      };
      
      setConfig(newConfig);
      setPrizes(prizesRes?.data || []);
      // Sync to local storage
      saveBackgroundConfig(newConfig);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setConfig(getBackgroundConfig()); // fallback
    }
  };

  useEffect(() => {
    fetchSettings();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'REMOTE_DRAW_SUCCESS' && e.newValue) {
        fetchSettings();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (!config) return null;

  const handleSave = async () => {
    if (config) {
      try {
        const { scheduledWinners, backgroundImage, ...rest } = config;
        // backgroundImage is managed separately via file upload API,
        // so we only send backgroundImage if it's a URL (not Base64)
        const app_appearance = {
          ...rest,
          backgroundImage: backgroundImage && !backgroundImage.startsWith('data:') ? backgroundImage : (config.backgroundImage || ''),
        };
        await fetchAPI('/api/settings', {
          method: 'PUT',
          body: JSON.stringify({ app_appearance })
        });
        
        saveBackgroundConfig(config);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
        setToastMessage('Konfigurasi berhasil disimpan.');
        setTimeout(() => setToastMessage(''), 3000);
      } catch (err: any) {
        alert(err.message || 'Gagal menyimpan konfigurasi');
      }
    }
  };

  const addScheduledWinner = async () => {
    if (!newWinner.name || !newWinner.nik || !newWinner.prizeId) {
      alert('Harap pilih Peserta dan Hadiah');
      return;
    }
    
    setIsAddingWinner(true);
    try {
      await fetchAPI('/api/scheduled-winners', {
        method: 'POST',
        body: JSON.stringify({
          name: newWinner.name,
          nik: newWinner.nik,
          prize_id: newWinner.prizeId,
          priority: 1
        })
      });
      // Only refresh scheduled winners list (lighter than full fetchSettings)
      const scheduledRes = await fetchAPI('/api/scheduled-winners');
      if (config) {
        setConfig({ ...config, scheduledWinners: scheduledRes?.data || [] });
      }
      setNewWinner({ name: '', nik: '', prizeId: '' });
      setParticipantSearch('');
      setToastMessage('Pemenang terjadwal berhasil ditambahkan.');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal menambahkan pemenang terjadwal');
    } finally {
      setIsAddingWinner(false);
    }
  };

  const removeScheduledWinner = async (id: string) => {
    if (!confirm('Hapus antrian ini?')) return;
    try {
      await fetchAPI(`/api/scheduled-winners/${id}`, { method: 'DELETE' });
      await fetchSettings();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus antrian');
    }
  };



  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar (Maksimal 5MB)');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetchAPI('/api/settings/background-image', {
        method: 'POST',
        body: formData,
      });

      if (res?.data?.backgroundImage) {
        setConfig({ ...config, backgroundImage: res.data.backgroundImage, useImageBackground: true });
        saveBackgroundConfig({ ...config, backgroundImage: res.data.backgroundImage, useImageBackground: true });
        setToastMessage('Background image berhasil diupload.');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Gagal mengupload gambar');
    } finally {
      setIsUploadingImage(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleRemoveImage = async () => {
    try {
      await fetchAPI('/api/settings/background-image', { method: 'DELETE' });
      setConfig({ ...config, backgroundImage: '', useImageBackground: false });
      saveBackgroundConfig({ ...config, backgroundImage: '', useImageBackground: false });
      setToastMessage('Background image berhasil dihapus.');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus gambar');
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
      {/* Toast Message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3.5 bg-white border border-green-200 rounded-2xl shadow-xl shadow-green-900/5"
          >
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-bold text-gray-800 pr-2">{toastMessage}</p>
            <button
              onClick={() => setToastMessage('')}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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


          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-hidden relative">
             <h3 className="text-gray-900 font-bold mb-4">Preview Atas</h3>
             <div 
               className="w-full h-48 md:h-56 rounded-xl shadow-inner flex items-center justify-center text-center p-4 relative overflow-hidden"
               style={{
                 background: config.backgroundImage
                   ? `url(${config.backgroundImage}) center/cover no-repeat`
                   : `#1e293b`
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
              Tampilan
            </h3>
            <div className="space-y-4">
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
                Konfigurasi Background Gambar
              </h3>
            </div>

              <div className="space-y-6">
                <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50/50 hover:bg-white hover:border-blue-300 transition-all group min-h-[300px] relative">
                   {config.backgroundImage ? (
                     <div className="relative w-full h-[250px] md:h-[400px] rounded-xl overflow-hidden shadow-lg mb-4">
                        <img src={config.backgroundImage} className="w-full h-full object-cover" alt="Background Preview" />
                        <button 
                          onClick={handleRemoveImage}
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
                   {isUploadingImage && (
                     <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center rounded-2xl">
                       <svg className="w-10 h-10 animate-spin text-blue-600 mb-3" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       <p className="text-sm font-bold text-gray-600">Mengupload gambar...</p>
                     </div>
                   )}
                   <input
                     type="file"
                     accept="image/jpeg,image/png,image/jpg,image/webp"
                     onChange={handleImageUpload}
                     className="absolute inset-0 opacity-0 cursor-pointer z-0"
                     title=""
                     disabled={isUploadingImage}
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
                   <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-[11px] text-green-700 font-medium leading-relaxed">
                        Gambar akan diupload langsung ke server saat dipilih. Maks 5MB. Format: JPG, PNG, WebP.
                      </p>
                   </div>
                </div>
              </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3 italic">
              <span className="text-blue-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </span>
              <p className="text-xs text-blue-700 font-medium leading-relaxed">
                Gunakan gambar dengan resolusi tinggi (FHD) untuk hasil visual terbaik di layar panggung.
              </p>
            </div>
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
                <div className="space-y-1.5 md:col-span-2 relative">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Cari Peserta Terdaftar (Nama / NIK)</label>
                  <input 
                    type="text" 
                    value={participantSearch}
                    onChange={(e) => {
                      setParticipantSearch(e.target.value);
                      if (newWinner.nik) setNewWinner({ ...newWinner, name: '', nik: '' });
                    }}
                    onFocus={() => { if (participants.length > 0 && !newWinner.nik) setShowDropdown(true); }}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 transition-all font-bold"
                    placeholder="Ketik nama atau NIK peserta..."
                  />
                  {newWinner.nik && (
                    <div className="absolute top-[28px] right-2 px-2 py-1 bg-green-100 text-green-700 text-[10px] rounded-md font-bold flex items-center gap-1 shadow-sm">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      {newWinner.nik}
                    </div>
                  )}

                  {showDropdown && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                      {isSearching ? (
                        <div className="p-3 text-sm text-gray-500 text-center font-medium">Mencari...</div>
                      ) : participants.length > 0 ? (
                        participants.map((p) => (
                          <div 
                            key={p.id} 
                            className="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                            onClick={() => {
                              setNewWinner({ ...newWinner, name: p.name, nik: p.nik });
                              setParticipantSearch(p.name);
                              setShowDropdown(false);
                            }}
                          >
                            <div className="font-bold text-sm text-gray-900">{p.name}</div>
                            <div className="text-xs text-gray-500 font-medium">{p.nik} <span className="text-gray-300 mx-1">•</span> {p.department || p.shop_name || 'Umum'}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-gray-500 text-center font-medium">Tidak ada peserta cocok</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Hadiah yg Didapat</label>
                  <select 
                    value={newWinner.prizeId}
                    onChange={(e) => setNewWinner({ ...newWinner, prizeId: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 transition-all font-bold"
                  >
                    <option value="">Pilih Hadiah</option>
                    {prizes.map(p => (
                      <option key={p.id} value={p.id} disabled={p.qty <= 0}>
                        {p.name} {p.qty !== undefined ? `(Sisa: ${p.qty})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button 
                onClick={addScheduledWinner}
                disabled={isAddingWinner}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                {isAddingWinner ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambahkan ke Daftar Pemenang
                  </>
                )}
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
                  {config.scheduledWinners && config.scheduledWinners.length > 0 ? config.scheduledWinners.map((w: any) => (
                    <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-bold text-gray-800">{w.name}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-500">{w.nik}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wide border border-blue-100">
                          {w.prize?.name || w.prizeName || 'Hadiah Default'}
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
