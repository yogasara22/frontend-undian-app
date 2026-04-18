'use client';

import { useState, useRef } from 'react';
import { dummyParticipants } from '../../lib/dummy';
import type { Participant } from '../../types';

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>(dummyParticipants);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [importMsg, setImportMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const departments = Array.from(new Set(participants.map(p => p.department).filter(Boolean)));

  const filtered = participants.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.email?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchDept = !filterDept || p.department === filterDept;
    return matchSearch && matchDept;
  });

  const handleAdd = () => {
    if (!newName.trim()) return;
    const newParticipant: Participant = {
      id: participants.length + 1,
      name: newName.trim(),
      department: newDept.trim() || 'General',
      email: newEmail.trim() || undefined,
    };
    setParticipants([...participants, newParticipant]);
    setNewName('');
    setNewDept('');
    setNewEmail('');
    setShowAddModal(false);
  };

  const handleDelete = (id: string | number) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleImport = () => {
    fileRef.current?.click();
  };

  const handleFileChange = () => {
    setImportMsg('✅ Data berhasil diimport (Demo Mode)');
    setTimeout(() => setImportMsg(''), 3000);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Manajemen Peserta</h2>
          <p className="text-gray-500 text-sm mt-0.5">{participants.length} peserta terdaftar</p>
        </div>
        <div className="flex gap-3">
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all text-sm font-semibold shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Import Excel
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-all text-sm font-semibold shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Peserta
          </button>
        </div>
      </div>

      {importMsg && (
        <div className="px-5 py-4 rounded-xl bg-green-50 border border-green-200 text-green-700 font-semibold shadow-sm text-sm">
          {importMsg}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari peserta..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm"
          />
        </div>
        <select
          value={filterDept}
          onChange={e => setFilterDept(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm font-medium"
        >
          <option value="">Semua Departemen</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="text-left px-6 py-4 text-gray-500 font-bold">#</th>
              <th className="text-left px-6 py-4 text-gray-500 font-bold">Nama</th>
              <th className="text-left px-6 py-4 text-gray-500 font-bold hidden md:table-cell">Email</th>
              <th className="text-left px-6 py-4 text-gray-500 font-bold hidden sm:table-cell">Departemen</th>
              <th className="text-right px-6 py-4 text-gray-500 font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium bg-gray-50/30">
                  Tidak ada peserta ditemukan
                </td>
              </tr>
            ) : (
              filtered.map((p, i) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-400 font-semibold">{i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                        {p.name.charAt(0)}
                      </div>
                      <span className="text-gray-900 font-bold">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium hidden md:table-cell">{p.email || '-'}</td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="px-3 py-1.5 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-semibold border-b-2">
                      {p.department || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors inline-block"
                      title="Hapus peserta"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-gray-900 font-black text-xl">Tambah Peserta</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">Nama *</label>
                <input
                  type="text"
                  placeholder="Nama lengkap"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">Departemen</label>
                <input
                  type="text"
                  placeholder="Contoh: Engineering"
                  value={newDept}
                  onChange={e => setNewDept(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">Email</label>
                <input
                  type="email"
                  placeholder="email@perusahaan.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                />
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
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
