'use client';

import { useState } from 'react';
import { dummyPrizes } from '../../lib/dummy';
import { dummyCategories } from '../../lib/dashboardDummy';
import type { Prize } from '../../types';

export default function PrizesPage() {
  const [prizes, setPrizes] = useState<Prize[]>(dummyPrizes);
  const [filterCategory, setFilterCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const filtered = prizes.filter(p =>
    !filterCategory || p.description === filterCategory
  );

  const handleAdd = () => {
    if (!newName.trim()) return;
    const newPrize: Prize = {
      id: prizes.length + 1,
      name: newName.trim(),
      value: newValue.trim() || 'Rp 0',
      description: newDesc.trim() || filterCategory || dummyCategories[0].name,
    };
    setPrizes([...prizes, newPrize]);
    setNewName('');
    setNewValue('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const handleDelete = (id: string | number) => {
    setPrizes(prizes.filter(p => p.id !== id));
  };

  const prizeIcons = ['🎁', '💻', '📱', '📺', '🚲', '🛍️', '🎧'];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Manajemen Hadiah</h2>
          <p className="text-gray-500 text-sm mt-0.5">{prizes.length} hadiah tersedia</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-all text-sm font-semibold shadow-sm shadow-orange-600/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Hadiah
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
            !filterCategory
              ? 'bg-orange-100 border-orange-200 text-orange-700'
              : 'bg-white border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-600'
          }`}
        >
          Semua
        </button>
        {dummyCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
              filterCategory === cat.name
                ? 'bg-orange-100 border-orange-200 text-orange-700'
                : 'bg-white border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-600'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Prize Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {(filterCategory ? filtered : prizes).map((prize, i) => (
          <div
            key={prize.id}
            className="group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleDelete(prize.id)}
                className="text-gray-300 hover:text-red-500 bg-white hover:bg-red-50 rounded-lg p-2 transition-colors shadow-sm border border-transparent hover:border-red-100 block"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div className="w-16 h-16 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl text-4xl mb-5 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
              {prizeIcons[i % prizeIcons.length]}
            </div>
            <h3 className="text-gray-900 font-black text-lg mb-1">{prize.name}</h3>
            <p className="text-orange-600 font-bold text-xl mb-3">{prize.value}</p>
            {prize.description && (
              <span className="inline-block px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-semibold">
                {prize.description}
              </span>
            )}
          </div>
        ))}

        {/* Add card */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex flex-col items-center justify-center gap-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300 group min-h-[220px]"
        >
          <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 group-hover:bg-orange-100 group-hover:border-orange-200 transition-colors flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400 group-hover:text-orange-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-gray-500 group-hover:text-orange-600 font-bold text-sm transition-colors">Tambah Hadiah Baru</span>
        </button>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-gray-900 font-black text-xl">Tambah Hadiah Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">Nama Hadiah *</label>
                <input
                  type="text"
                  placeholder="Contoh: Laptop Gaming"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">Nilai Hadiah</label>
                <input
                  type="text"
                  placeholder="Contoh: Rp 5.000.000"
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">Kategori</label>
                <select
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium appearance-none"
                >
                  <option value="">Pilih kategori...</option>
                  {dummyCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all text-sm font-bold shadow-sm"
              >
                Batal
              </button>
              <button
                onClick={handleAdd}
                disabled={!newName.trim()}
                className="flex-1 px-4 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all text-sm font-bold shadow-sm shadow-orange-600/30"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
