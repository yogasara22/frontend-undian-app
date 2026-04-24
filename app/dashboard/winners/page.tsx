'use client';

import { useState, useEffect } from 'react';
import { fetchAPI } from '../../lib/api';
import Link from 'next/link';

export default function WinnersPage() {
  const [winners, setWinners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMsg, setDrawMsg] = useState('');
  const [isLoadingWinners, setIsLoadingWinners] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory]);

  const fetchWinners = async () => {
    setIsLoadingWinners(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
      });
      if (debouncedSearch) queryParams.append('search', debouncedSearch);
      if (filterCategory) queryParams.append('category', filterCategory);

      const res = await fetchAPI(`/api/dashboard/recent-winners?${queryParams.toString()}`);
      if (res?.data) {
        const mapped = res.data.map((w: any) => ({
          id: w.id,
          name: w.participant?.name || 'Unknown',
          department: w.participant?.department || '-',
          prize: w.prize?.name || 'Unknown Prize',
          category: w.prize?.category?.name || '-',
          drawnAt: w.drawnAt ? new Date(w.drawnAt).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short'
          }) : '-',
        }));
        setWinners(mapped);
        
        if (res.meta) {
          setCurrentPage(res.meta.current_page);
          setTotalPages(res.meta.last_page);
          setTotalItems(res.meta.total);
        }
      }
    } catch (e) {
      console.error('Failed to fetch winners', e);
    } finally {
      setIsLoadingWinners(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetchAPI('/api/categories');
      if (res?.data) {
        setCategories(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch categories', e);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, [currentPage, debouncedSearch, filterCategory]);

  useEffect(() => {
    fetchCategories();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'REMOTE_DRAW_SUCCESS' && e.newValue) {
        setIsDrawing(false);
        setDrawMsg('✅ Undian berhasil! Pemenang telah direkam.');
        fetchWinners();
        setTimeout(() => setDrawMsg(''), 5000);
      }
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleDraw = async () => {
    setIsDrawing(true);
    setDrawMsg('Meminta layar undian untuk mengundi...');
    
    // Trigger Layar Undian via cross-tab communication
    localStorage.setItem('REMOTE_DRAW_TRIGGER', Date.now().toString());
    
    // Fallback if no Layar Undian is open
    setTimeout(() => {
      setIsDrawing(prev => {
        if (prev) {
          setDrawMsg('⚠️ Layar undian tidak merespons. Pastikan tab Layar Undian terbuka.');
          setTimeout(() => setDrawMsg(''), 5000);
          return false;
        }
        return prev;
      });
    }, 10000);
  };

  const handleDelete = (id: number) => {
    setWinners(winners.filter(w => w.id !== id));
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Pemenang Undian</h2>
          <p className="text-gray-500 text-sm mt-0.5">{winners.length} pemenang tercatat</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all text-sm font-semibold shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Layar Undian
          </Link>
          <button
            onClick={handleDraw}
            disabled={isDrawing}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-all text-sm font-bold shadow-sm shadow-orange-600/30"
          >
            {isDrawing ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Mengundi...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                </svg>
                Undi Sekarang
              </>
            )}
          </button>
        </div>
      </div>

      {drawMsg && (
        <div className="px-5 py-4 rounded-xl bg-green-50 border border-green-200 text-green-700 font-semibold shadow-sm text-sm">
          {drawMsg}
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
            placeholder="Cari pemenang atau hadiah..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm font-medium"
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm font-medium appearance-none"
        >
          <option value="">Semua Kategori</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Summary Stats */}
      {winners.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => {
            const count = winners.filter(w => w.category === cat.name).length;
            if (count === 0) return null;
            return (
              <div key={cat.id} className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm">
                <div className="text-2xl font-black text-gray-900 mb-0.5">{count}</div>
                <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{cat.name}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Winners Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px] md:min-w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="text-left px-4 py-2 text-gray-400 font-bold text-[11px] uppercase tracking-wider">#</th>
                <th className="text-left px-4 py-2 text-gray-400 font-bold text-[11px] uppercase tracking-wider">Pemenang</th>
                <th className="text-left px-4 py-2 text-gray-400 font-bold text-[11px] uppercase tracking-wider hidden md:table-cell">Departemen</th>
                <th className="text-left px-4 py-2 text-gray-400 font-bold text-[11px] uppercase tracking-wider">Hadiah</th>
                <th className="text-left px-4 py-2 text-gray-400 font-bold text-[11px] uppercase tracking-wider hidden sm:table-cell">Kategori</th>
                <th className="text-left px-4 py-2 text-gray-400 font-bold text-[11px] uppercase tracking-wider hidden lg:table-cell">Waktu</th>
                <th className="text-right px-4 py-2 text-gray-400 font-bold text-[11px] uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingWinners ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-8 h-8 animate-spin text-orange-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-gray-400 font-medium text-sm">Memuat data pemenang...</span>
                    </div>
                  </td>
                </tr>
              ) : winners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-medium bg-gray-50/30">
                    Tidak ada pemenang ditemukan
                  </td>
                </tr>
              ) : (
                winners.map((w, i) => (
                  <tr key={w.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-1.5">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 border border-gray-100 font-bold text-gray-600">
                        {(currentPage === 1 && i < 3) ? (
                          <span className="text-xs">{['🥇', '🥈', '🥉'][i]}</span>
                        ) : (
                          <span className="text-[9px]">{(currentPage - 1) * perPage + i + 1}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 text-[9px] font-black flex-shrink-0">
                          {w.name.charAt(0)}
                        </div>
                        <span className="text-gray-900 font-bold text-xs">{w.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-1.5 text-gray-400 font-medium text-[10px] hidden md:table-cell">{w.department}</td>
                    <td className="px-4 py-1.5 text-orange-600 font-bold text-xs tracking-tight">{w.prize}</td>
                    <td className="px-4 py-1.5 hidden sm:table-cell">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tight">
                        {w.category}
                      </span>
                    </td>
                    <td className="px-4 py-1.5 text-gray-400 font-medium text-[9px] hidden lg:table-cell">{w.drawnAt}</td>
                    <td className="px-4 py-1.5 text-right">
                      <button
                        onClick={() => handleDelete(w.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors inline-block"
                        title="Batalkan pemenang"
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
    </div>
  );
}
