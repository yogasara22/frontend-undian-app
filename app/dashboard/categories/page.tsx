'use client';

import { useState } from 'react';
import { dummyCategories, type Category } from '../../lib/dashboardDummy';

const colorMap: Record<string, { badge: string; dot: string; border: string }> = {
  amber: {
    badge: 'bg-orange-50 text-orange-600 border-orange-200',
    dot: 'bg-orange-500',
    border: 'border-orange-200 hover:border-orange-400',
  },
  violet: {
    badge: 'bg-purple-50 text-purple-600 border-purple-200',
    dot: 'bg-purple-500',
    border: 'border-purple-200 hover:border-purple-400',
  },
  cyan: {
    badge: 'bg-blue-50 text-blue-600 border-blue-200',
    dot: 'bg-blue-500',
    border: 'border-blue-200 hover:border-blue-400',
  },
  emerald: {
    badge: 'bg-green-50 text-green-600 border-green-200',
    dot: 'bg-green-500',
    border: 'border-green-200 hover:border-green-400',
  },
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(dummyCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newColor, setNewColor] = useState('violet');
  const [editId, setEditId] = useState<number | null>(null);

  const colors = ['violet', 'amber', 'cyan', 'emerald'];
  const colorLabels: Record<string, string> = {
    violet: 'Ungu',
    amber: 'Oranye',
    cyan: 'Biru',
    emerald: 'Hijau',
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    if (editId !== null) {
      setCategories(categories.map(c =>
        c.id === editId ? { ...c, name: newName.trim(), description: newDesc.trim(), color: newColor } : c
      ));
      setEditId(null);
    } else {
      const newCat: Category = {
        id: categories.length + 1,
        name: newName.trim(),
        description: newDesc.trim(),
        color: newColor,
        prizeCount: 0,
      };
      setCategories([...categories, newCat]);
    }
    setNewName('');
    setNewDesc('');
    setNewColor('violet');
    setShowAddModal(false);
  };

  const handleEdit = (cat: Category) => {
    setEditId(cat.id);
    setNewName(cat.name);
    setNewDesc(cat.description);
    setNewColor(cat.color);
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Manajemen Kategori</h2>
          <p className="text-gray-500 text-sm mt-0.5">{categories.length} kategori tersedia</p>
        </div>
        <button
          onClick={() => {
            setEditId(null);
            setNewName('');
            setNewDesc('');
            setNewColor('violet');
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-all text-sm font-semibold shadow-sm shadow-orange-600/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Kategori
        </button>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(cat => {
          const colors2 = colorMap[cat.color] ?? colorMap.violet;
          return (
            <div
              key={cat.id}
              className={`group relative bg-white border rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-lg ${colors2.border}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-md ${colors2.dot} shadow-sm`} />
                  <h3 className="text-gray-900 font-bold text-lg">{cat.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-gray-400 hover:text-blue-500 bg-gray-50 hover:bg-blue-50 border border-gray-100 p-2 rounded-lg transition-colors shadow-sm"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 border border-gray-100 p-2 rounded-lg transition-colors shadow-sm"
                    title="Hapus"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-gray-500 font-medium text-sm mb-5 leading-relaxed">{cat.description}</p>
              <div className="flex items-center justify-between">
                <span className={`px-4 py-1.5 text-xs rounded-full border font-bold shadow-sm ${colors2.badge}`}>
                  {cat.prizeCount} Hadiah
                </span>
                <span className="text-gray-400 text-xs font-semibold bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">ID #{cat.id}</span>
              </div>
            </div>
          );
        })}

        {/* Add card */}
        <button
          onClick={() => {
            setEditId(null);
            setNewName('');
            setNewDesc('');
            setNewColor('violet');
            setShowAddModal(true);
          }}
          className="flex flex-col items-center justify-center gap-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300 group min-h-[180px]"
        >
          <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 group-hover:bg-orange-100 group-hover:border-orange-200 transition-colors flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400 group-hover:text-orange-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-gray-500 group-hover:text-orange-600 font-bold text-sm transition-colors">Tambah Kategori</span>
        </button>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-gray-900 font-black text-xl">
                {editId !== null ? 'Edit Kategori' : 'Tambah Kategori'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">Nama Kategori *</label>
                <input
                  type="text"
                  placeholder="Contoh: Hadiah Utama"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">Deskripsi</label>
                <textarea
                  placeholder="Deskripsi singkat kategori..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium resize-none"
                />
              </div>
              <div>
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-3 block">Warna Tema</label>
                <div className="grid grid-cols-2 gap-3">
                  {colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setNewColor(c)}
                      className={`flex items-center justify-center py-2.5 rounded-xl text-sm font-bold border transition-all ${
                        newColor === c
                          ? colorMap[c].badge + ' ' + colorMap[c].border + ' shadow-sm'
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {colorLabels[c]}
                    </button>
                  ))}
                </div>
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
                {editId !== null ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
