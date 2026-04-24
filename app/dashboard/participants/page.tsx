'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import { fetchAPI } from '../../lib/api';
import type { Participant } from '../../types';

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage] = useState(10);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newShop, setNewShop] = useState('');
  const [newKtp, setNewKtp] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  
  const [importMsg, setImportMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [showImportModal, setShowImportModal] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchParticipants = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
      });
      if (debouncedSearch) queryParams.append('search', debouncedSearch);

      const res = await fetchAPI(`/api/participants?${queryParams.toString()}`);
      if (res && res.data) {
        // Map backend snake_case to frontend camelCase
        const mapped = res.data.map((p: any) => ({
          ...p,
          ktpNumber: p.nik,
          shopName: p.shop_name,
          phoneNumber: p.phone_number,
        }));
        setParticipants(mapped);
        if (res.meta) {
          setCurrentPage(res.meta.current_page);
          setTotalPages(res.meta.last_page);
          setTotalItems(res.meta.total);
        }
      }
    } catch (err) {
      console.error('Error fetching participants:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [currentPage, debouncedSearch]);

  const closeModal = () => {
    setEditingId(null);
    setNewName('');
    setNewDept('');
    setNewEmail('');
    setNewShop('');
    setNewKtp('');
    setNewPhone('');
    setNewAddress('');
    setShowAddModal(false);
  };

  const openEditModal = (p: Participant) => {
    setEditingId(p.id);
    setNewName(p.name);
    setNewDept(p.department || '');
    setNewEmail(p.email || '');
    setNewShop(p.shopName || '');
    setNewKtp(p.ktpNumber || '');
    setNewPhone(p.phoneNumber || '');
    setNewAddress(p.address || '');
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!newName.trim()) return;
    try {
      const payload = {
        name: newName.trim(),
        nik: newKtp.trim() || undefined,
        department: newDept.trim() || 'General',
        email: newEmail.trim() || undefined,
        shop_name: newShop.trim() || undefined,
        phone_number: newPhone.trim() || undefined,
        address: newAddress.trim() || undefined,
      };

      if (editingId) {
        await fetchAPI(`/api/participants/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setToastMessage('Peserta berhasil diperbarui.');
      } else {
        await fetchAPI('/api/participants', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setToastMessage('Peserta berhasil ditambahkan.');
      }

      await fetchParticipants();
      closeModal();
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan peserta');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus peserta ini?')) return;
    try {
      await fetchAPI(`/api/participants/${id}`, { method: 'DELETE' });
      setParticipants(participants.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus peserta');
    }
  };

  const handleImport = () => {
    setShowImportModal(true);
    setPreviewData([]);
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Nama: 'Budi Santoso', NIK: '1234567890123456', Toko: 'Toko Budi', Email: 'budi@example.com', No_HP: '08123456789', Kota_Departemen: 'Jakarta', Alamat: 'Jl. Merdeka' }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'Template_Peserta.xlsx');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setPreviewData(data);
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handleSaveImport = async () => {
    setIsImporting(true);
    setImportProgress({ current: 0, total: previewData.length });
    
    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < previewData.length; i++) {
      const row: any = previewData[i];
      try {
        const payload = {
          name: row.Nama || row.name,
          nik: String(row.NIK || row.nik || '').trim(),
          department: row.Kota_Departemen || row.department || 'General',
          email: row.Email || row.email || undefined,
          shop_name: row.Toko || row.shop_name || undefined,
          phone_number: String(row.No_HP || row.phone_number || '').trim(),
          address: row.Alamat || row.address || undefined,
        };

        if (payload.name && payload.nik) {
          await fetchAPI('/api/participants', {
            method: 'POST',
            body: JSON.stringify(payload),
          });
          successCount++;
        } else {
           failedCount++;
           errors.push(`Baris ${i + 1}: Nama dan NIK wajib diisi`);
        }
      } catch (e: any) {
        failedCount++;
        const errMsg = e.message || 'Gagal menyimpan';
        errors.push(`Baris ${i + 1} (${row.Nama || 'Tanpa Nama'}): ${errMsg.replace(/\n/g, ' ')}`);
      }
      setImportProgress(prev => ({ ...prev, current: prev.current + 1 }));
    }

    setIsImporting(false);
    setShowImportModal(false);
    setPreviewData([]);
    
    if (failedCount > 0) {
      alert(`Selesai! Berhasil: ${successCount}, Gagal: ${failedCount}\n\nBeberapa error:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n...' : ''}`);
    } else {
      setToastMessage(`Berhasil mengimpor ${successCount} data peserta.`);
      setTimeout(() => setToastMessage(''), 3000);
    }
    
    fetchParticipants();
  };

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
          <h2 className="text-2xl font-black text-gray-900">Manajemen Peserta</h2>
          <p className="text-gray-500 text-sm mt-0.5">{totalItems} peserta terdaftar</p>
        </div>
        <div className="flex gap-3">
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



      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari peserta (Nama, NIK, Toko, Dept, dll)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px] md:min-w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="text-left px-4 py-2 text-gray-400 font-bold text-[11px] uppercase tracking-wider">#</th>
                <th className="text-left px-4 py-2 text-gray-400 font-bold text-[11px] uppercase tracking-wider w-[220px]">Nama & Toko</th>
                <th className="text-left px-4 py-2 text-gray-400 font-bold text-[11px] uppercase tracking-wider">NIK</th>
                <th className="text-left px-4 py-2 text-gray-400 font-bold text-[11px] uppercase tracking-wider">No. HP</th>
                <th className="text-left px-4 py-2 text-gray-400 font-bold text-[11px] uppercase tracking-wider hidden lg:table-cell">Alamat</th>
                <th className="text-left px-4 py-2 text-gray-400 font-bold text-[11px] uppercase tracking-wider hidden sm:table-cell">Kota</th>
                <th className="text-right px-4 py-2 text-gray-400 font-bold text-[11px] uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400 font-medium bg-gray-50/30">
                    <div className="flex justify-center mb-2">
                      <svg className="w-6 h-6 animate-spin text-orange-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    Memuat data...
                  </td>
                </tr>
              ) : participants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400 font-medium bg-gray-50/30">
                    Tidak ada peserta ditemukan
                  </td>
                </tr>
              ) : (
                participants.map((p, i) => (
                  <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-1.5 text-gray-400 font-semibold text-[11px]">{(currentPage - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-1.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-[9px] font-black flex-shrink-0">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-gray-900 font-bold leading-tight text-xs">{p.name}</div>
                          {p.shopName && (
                            <div className="text-orange-600 text-[9px] font-bold uppercase tracking-tight">{p.shopName}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-1.5 font-mono text-[10px] text-gray-400">
                      {p.ktpNumber || '-'}
                    </td>
                    <td className="px-4 py-1.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-green-50 text-green-700 border border-green-100 text-[9px] font-bold">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {p.phoneNumber || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-1.5 text-gray-400 text-[10px] font-medium hidden lg:table-cell truncate max-w-[180px]" title={p.address}>
                      {p.address || '-'}
                    </td>
                    <td className="px-4 py-1.5 hidden sm:table-cell">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        {p.department || 'General'}
                      </span>
                    </td>
                    <td className="px-4 py-1.5 text-right">
                      <button
                        onClick={() => openEditModal(p)}
                        className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-block mr-1"
                        title="Edit peserta"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
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
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-2xl shadow-sm mt-4">
          <div className="flex-1 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Menampilkan <span className="font-medium">{(currentPage - 1) * perPage + 1}</span> hingga <span className="font-medium">{Math.min(currentPage * perPage, totalItems)}</span> dari <span className="font-medium">{totalItems}</span> hasil
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-4 w-full max-w-xl shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 font-black text-xl">{editingId ? 'Edit Peserta' : 'Tambah Peserta'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2">
              <div className="md:col-span-2">
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">Nama Lengkap *</label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">Nama Toko</label>
                <input
                  type="text"
                  placeholder="Contoh: Toko Berkah Jaya"
                  value={newShop}
                  onChange={e => setNewShop(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">NIK (KTP)</label>
                <input
                  type="text"
                  placeholder="16 digit angka"
                  value={newKtp}
                  onChange={e => setNewKtp(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">No. HP / WhatsApp</label>
                <input
                  type="text"
                  placeholder="Contoh: 081234567890"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">Email</label>
                <input
                  type="email"
                  placeholder="admin@toko.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">Kota / Wilayah</label>
                <input
                  type="text"
                  placeholder="Contoh: Jakarta"
                  value={newDept}
                  onChange={e => setNewDept(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 block">Alamat Lengkap</label>
                <textarea
                  placeholder="Jl. Merdeka No. 123..."
                  value={newAddress}
                  onChange={e => setNewAddress(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium resize-none"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
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
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 w-full max-w-4xl shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 font-black text-xl">Import Data Peserta dari Excel</h3>
              <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {!isImporting ? (
              <>
                <div className="flex flex-wrap gap-4 mb-6">
                  <button
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-sm font-bold shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Template
                  </button>
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 transition-all text-sm font-bold shadow-sm cursor-pointer">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload File Excel
                    <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>

                {previewData.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-700 mb-2">Preview Data ({previewData.length} baris)</h4>
                    <div className="overflow-x-auto border border-gray-200 rounded-xl max-h-[40vh] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            {Object.keys(previewData[0] || {}).map((key) => (
                              <th key={key} className="text-left px-4 py-2 text-gray-600 font-bold text-xs">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.slice(0, 100).map((row, i) => (
                            <tr key={i} className="border-t border-gray-100">
                              {Object.values(row).map((val: any, j) => (
                                <td key={j} className="px-4 py-1.5 text-gray-600 text-xs">{val}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {previewData.length > 100 && (
                        <div className="text-center p-2 text-xs text-gray-500 bg-gray-50">Menampilkan 100 baris pertama dari {previewData.length}</div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => {
                      setShowImportModal(false);
                      setPreviewData([]);
                    }}
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all text-sm font-bold shadow-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveImport}
                    disabled={previewData.length === 0}
                    className="flex-1 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all text-sm font-bold shadow-sm shadow-orange-600/30"
                  >
                    Simpan Data
                  </button>
                </div>
              </>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center">
                <svg className="w-12 h-12 animate-spin text-orange-500 mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Menyimpan Data...</h4>
                <p className="text-gray-500 mb-4">
                  {importProgress.current} dari {importProgress.total} berhasil disimpan
                </p>
                <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-600 h-2.5 rounded-full" style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
