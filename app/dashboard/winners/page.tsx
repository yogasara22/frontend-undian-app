'use client';

import { useState } from 'react';
import { dummyWinners, dummyCategories } from '../../lib/dashboardDummy';
import type { DashboardWinner } from '../../lib/dashboardDummy';
import Link from 'next/link';

export default function WinnersPage() {
  const [winners, setWinners] = useState<DashboardWinner[]>(dummyWinners);
  const [filterCategory, setFilterCategory] = useState('');
  const [search, setSearch] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMsg, setDrawMsg] = useState('');

  const filtered = winners.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.prize.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCategory || w.category === filterCategory;
    return matchSearch && matchCat;
  });

  const handleDraw = async () => {
    setIsDrawing(true);
    setDrawMsg('');
    await new Promise(r => setTimeout(r, 1500));
    setIsDrawing(false);
    setDrawMsg('✅ Undian berhasil! Buka layar undian untuk melihat hasilnya.');
    setTimeout(() => setDrawMsg(''), 4000);
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
          {dummyCategories.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Summary Stats */}
      {winners.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dummyCategories.map(cat => {
            const count = winners.filter(w => w.category === cat.name).length;
            if (count === 0) return null;
            return (
              <div key={cat.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="text-3xl font-black text-gray-900 mb-1">{count}</div>
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">{cat.name}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Winners Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="text-left px-6 py-4 text-gray-500 font-bold">#</th>
              <th className="text-left px-6 py-4 text-gray-500 font-bold">Pemenang</th>
              <th className="text-left px-6 py-4 text-gray-500 font-bold hidden md:table-cell">Departemen</th>
              <th className="text-left px-6 py-4 text-gray-500 font-bold">Hadiah</th>
              <th className="text-left px-6 py-4 text-gray-500 font-bold hidden sm:table-cell">Kategori</th>
              <th className="text-left px-6 py-4 text-gray-500 font-bold hidden lg:table-cell">Waktu</th>
              <th className="text-right px-6 py-4 text-gray-500 font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-medium bg-gray-50/30">
                  Tidak ada pemenang ditemukan
                </td>
              </tr>
            ) : (
              filtered.map((w, i) => (
                <tr key={w.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border border-gray-200 font-bold text-gray-600">
                      {i < 3 ? (
                        <span className="text-lg leading-none">{['🥇', '🥈', '🥉'][i]}</span>
                      ) : (
                        <span className="text-sm">{i + 1}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 text-xs font-bold flex-shrink-0">
                        {w.name.charAt(0)}
                      </div>
                      <span className="text-gray-900 font-bold">{w.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium hidden md:table-cell">{w.department}</td>
                  <td className="px-6 py-4 text-orange-600 font-bold text-base">{w.prize}</td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="px-3 py-1.5 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-200 font-bold">
                      {w.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-medium text-xs hidden lg:table-cell">{w.drawnAt}</td>
                  <td className="px-6 py-4 text-right">
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
  );
}
