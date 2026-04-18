'use client';

import Link from 'next/link';
import { dummyParticipants, dummyPrizes } from '../lib/dummy';
import { dummyCategories, dummyWinners, type DashboardWinner } from '../lib/dashboardDummy';

const stats = [
  {
    label: 'Total Peserta',
    value: dummyParticipants.length,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'bg-blue-50 text-blue-600',
    border: 'border-blue-100',
    href: '/dashboard/participants',
  },
  {
    label: 'Total Hadiah',
    value: dummyPrizes.length,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    color: 'bg-orange-50 text-orange-600',
    border: 'border-orange-100',
    href: '/dashboard/prizes',
  },
  {
    label: 'Total Kategori',
    value: dummyCategories.length,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 10V5a2 2 0 012-2z" />
      </svg>
    ),
    color: 'bg-purple-50 text-purple-600',
    border: 'border-purple-100',
    href: '/dashboard/categories',
  },
  {
    label: 'Total Pemenang',
    value: dummyWinners.length,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    color: 'bg-green-50 text-green-600',
    border: 'border-green-100',
    href: '/dashboard/winners',
  },
];

const quickActions = [
  {
    label: 'Import Excel',
    desc: 'Upload data peserta dari file Excel',
    icon: '📊',
    href: '/dashboard/participants',
    style: 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md',
  },
  {
    label: 'Tambah Hadiah',
    desc: 'Tambahkan hadiah untuk undian baru',
    icon: '🎁',
    href: '/dashboard/prizes',
    style: 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 hover:shadow-md',
  },
  {
    label: 'Mulai Undian',
    desc: 'Buka layar undian event',
    icon: '🎯',
    href: '/',
    style: 'border-gray-200 hover:border-red-300 hover:bg-red-50/50 hover:shadow-md',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-10 text-gray-800">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Selamat Datang 👋</h2>
        <p className="text-gray-500 text-sm">Kelola undian Anda dari sini. Semua data siap digunakan.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`group relative bg-white border ${stat.border} rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
          >
            <div className={`inline-flex p-3 rounded-xl ${stat.color} mb-4`}>
              <span>{stat.icon}</span>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
            <div className="text-gray-500 font-medium text-sm">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`flex items-center gap-4 p-5 rounded-2xl border bg-white transition-all duration-300 cursor-pointer ${action.style}`}
            >
              <span className="text-3xl bg-gray-50 p-2 rounded-xl border border-gray-100">{action.icon}</span>
              <div>
                <p className="text-gray-900 font-bold text-sm">{action.label}</p>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Winners */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Pemenang Terakhir</h3>
          <Link href="/dashboard/winners" className="text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors">
            Lihat Semua →
          </Link>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px] md:min-w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="text-left px-6 py-4 text-gray-500 font-bold">Nama</th>
                <th className="text-left px-6 py-4 text-gray-500 font-bold hidden md:table-cell">Departemen</th>
                <th className="text-left px-6 py-4 text-gray-500 font-bold">Hadiah</th>
                <th className="text-left px-6 py-4 text-gray-500 font-bold hidden sm:table-cell">Kategori</th>
              </tr>
            </thead>
            <tbody>
              {dummyWinners.slice(0, 5).map((winner: DashboardWinner, i: number) => (
                <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 text-xs font-bold">
                        {winner.name.charAt(0)}
                      </div>
                      <span className="text-gray-900 font-bold">{winner.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium hidden md:table-cell">{winner.department}</td>
                  <td className="px-6 py-4 text-orange-600 font-bold">{winner.prize}</td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-200 font-semibold">
                      {winner.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
}
