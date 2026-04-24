'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchAPI } from '../../lib/api';
import type { Prize } from '../../types';
import type { Category } from '../../lib/dashboardDummy';

export default function PrizesPage() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newQty, setNewQty] = useState('1');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = prizes.filter(p =>
    !filterCategory || 
    p.description === filterCategory || 
    (p as any).category?.name === filterCategory ||
    (p as any).categoryId?.toString() === filterCategory
  );

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prizesRes, categoriesRes] = await Promise.all([
        fetchAPI('/api/prizes'),
        fetchAPI('/api/categories')
      ]);
      setPrizes(prizesRes?.data || []);
      setCategories(categoriesRes?.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const closeModal = () => {
    setEditingId(null);
    setNewName('');
    setNewValue('');
    setNewDesc('');
    setNewQty('1');
    setNewImage(null);
    setNewImageFile(null);
    setShowAddModal(false);
  };

  const openEditModal = (p: any) => {
    setEditingId(p.id);
    setNewName(p.name || '');
    setNewValue(p.value || '');
    setNewDesc(p.categoryId ? p.categoryId.toString() : (p.description || ''));
    setNewQty(p.qty ? p.qty.toString() : '1');
    setNewImage(p.imageUrl || null);
    setNewImageFile(null);
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!newName.trim()) return;
    try {
      const formData = new FormData();
      formData.append('name', newName.trim());
      formData.append('qty', newQty || '1');
      
      if (editingId) {
        formData.append('_method', 'PUT');
      }

      if (newValue.trim()) formData.append('value', newValue.trim());
      
      if (newDesc.trim()) {
        const selectedCat = categories.find(c => c.name === newDesc.trim() || c.id.toString() === newDesc.trim());
        if (selectedCat) {
           formData.append('category_id', selectedCat.id.toString());
        } else {
           formData.append('description', newDesc.trim());
        }
      }
      
      if (newImageFile) {
        formData.append('image', newImageFile);
      }

      if (editingId) {
        await fetchAPI(`/api/prizes/${editingId}`, {
          method: 'POST',
          body: formData,
        });
        setToastMessage('Hadiah berhasil diperbarui.');
      } else {
        await fetchAPI('/api/prizes', {
          method: 'POST',
          body: formData,
        });
        setToastMessage('Hadiah berhasil ditambahkan.');
      }

      await fetchData();
      closeModal();
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan hadiah');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewImage(url);
      setNewImageFile(file);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Hapus hadiah ini?')) return;
    try {
      await fetchAPI(`/api/prizes/${id}`, { method: 'DELETE' });
      setPrizes(prizes.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus hadiah');
    }
  };

  const prizeIcons = ['🎁', '💻', '📱', '📺', '🚲', '🛍️', '🎧'];

  return (
    <div className="space-y-6 pb-10">
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
        {categories.map(cat => (
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
        {isLoading && prizes.length === 0 ? (
          <div className="col-span-1 sm:col-span-2 xl:col-span-3 py-12 text-center text-gray-400 font-medium">
            <div className="flex justify-center mb-2">
              <svg className="w-6 h-6 animate-spin text-orange-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            Memuat data...
          </div>
        ) : (filterCategory ? filtered : prizes).map((prize, i) => (
          <div
            key={prize.id}
            className="group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                onClick={() => openEditModal(prize)}
                className="text-gray-300 hover:text-blue-500 bg-white hover:bg-blue-50 rounded-lg p-2 transition-colors shadow-sm border border-transparent hover:border-blue-100 block"
                title="Edit hadiah"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(prize.id)}
                className="text-gray-300 hover:text-red-500 bg-white hover:bg-red-50 rounded-lg p-2 transition-colors shadow-sm border border-transparent hover:border-red-100 block"
                title="Hapus hadiah"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div className="w-16 h-16 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl text-4xl mb-5 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors overflow-hidden">
              {prize.imageUrl ? (
                <img src={prize.imageUrl} alt={prize.name} className="w-full h-full object-cover" />
              ) : (
                prizeIcons[i % prizeIcons.length]
              )}
            </div>
            <h3 className="text-gray-900 font-black text-lg mb-1">{prize.name}</h3>
            <p className="text-orange-600 font-bold text-xl mb-3">{prize.value}</p>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {((prize as any).category?.name || prize.description) && (
                <span className="inline-block px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-semibold">
                  {(prize as any).category?.name || prize.description}
                </span>
              )}
              {prize.remainingQty !== undefined && prize.qty !== undefined && (
                <span className={`inline-block px-3 py-1 text-xs rounded-full font-bold border ${prize.remainingQty > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {prize.remainingQty <= 0 ? 'Habis / Sold Out' : `Sisa: ${prize.remainingQty} / ${prize.qty}`}
                </span>
              )}
            </div>
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
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-4 w-full max-w-sm shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 font-black text-xl">{editingId ? 'Edit Hadiah' : 'Tambah Hadiah Baru'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2.5">
              <div>
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">Nama Hadiah *</label>
                <input
                  type="text"
                  placeholder="Contoh: Laptop Gaming"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">Total Stok Awal *</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Contoh: 10"
                  value={newQty}
                  onChange={e => setNewQty(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">Nilai Hadiah</label>
                <input
                  type="text"
                  placeholder="Contoh: Rp 5.000.000"
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
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
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">Gambar Hadiah</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full h-24 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-orange-300 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-1 group"
                >
                  {newImage ? (
                    <>
                      <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-full">Ganti Gambar</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-orange-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Klik untuk upload</span>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
              </div>
            </div>
            <div className="flex gap-4 mt-5">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all text-sm font-bold shadow-sm"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={!newName.trim()}
                className="flex-1 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all text-sm font-bold shadow-sm shadow-orange-600/30"
              >
                {editingId ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
