'use client';

import { useState, useEffect } from 'react';
import { getBackgroundConfig, saveBackgroundConfig, type GradientEntry, type BackgroundConfig } from '../../lib/settings';

export default function SettingsPage() {
  const [config, setConfig] = useState<BackgroundConfig | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    setConfig(getBackgroundConfig());
  }, []);

  if (!config) return null;

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
      gradients: [...config.gradients, { from: '#ffffff', via: '#cccccc', to: '#999999' }]
    });
  };

  const removeGradient = (index: number) => {
    if (config.gradients.length <= 1) return;
    const newGradients = config.gradients.filter((_, i) => i !== index);
    setConfig({ ...config, gradients: newGradients });
  };

  const handleSave = () => {
    setSaveStatus('saving');
    saveBackgroundConfig(config);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Konfigurasi Desain</h2>
          <p className="text-gray-500 text-sm font-medium">Atur durasi rotasi dan palet warna background utama.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveStatus !== 'idle'}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${
            saveStatus === 'saved' 
              ? 'bg-green-500 text-white' 
              : 'bg-orange-600 hover:bg-orange-700 text-white hover:shadow-lg active:scale-95 disabled:opacity-50'
          }`}
        >
          {saveStatus === 'saving' ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menyimpan...
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              Tersimpan!
            </>
          ) : (
            'Simpan Konfigurasi'
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Duration Settings */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Waktu Rotasi
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Interval Pergantian (Detik)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={config.duration / 1000}
                    onChange={(e) => handleDurationChange(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-bold text-gray-800"
                    placeholder="Contoh: 60"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold bg-white px-2 py-1 rounded-md border border-gray-100 italic">
                    Detik
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  Layar akan otomatis berganti pallet warna setiap interval waktu di atas habis.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-hidden relative">
             <h3 className="text-gray-900 font-bold mb-4">Preview Aktif</h3>
             <div 
               className="w-full h-40 rounded-xl shadow-inner flex items-center justify-center text-white font-black text-lg text-center p-4"
               style={{
                 background: `linear-gradient(135deg, ${config.gradients[0]?.from}, ${config.gradients[0]?.via}, ${config.gradients[0]?.to})`
               }}
             >
                <div className="drop-shadow-md">LIVE PREVIEW</div>
             </div>
             <p className="mt-3 text-[10px] text-gray-400 text-center uppercase font-bold tracking-widest">Contoh Tampilan Background Utama</p>
          </section>
        </div>

        {/* Right Column: Gradient Editor */}
        <div className="lg:col-span-2">
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                Koleksi Pallet Warna (Gradients)
              </h3>
              <button
                onClick={addGradient}
                className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Gradient
              </button>
            </div>

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
                Background akan berotasi secara berurutan sesuai daftar di atas. Gunakan kombinasi warna yang kontras dengan teks putih layar undian untuk keterbacaan maksimal.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
