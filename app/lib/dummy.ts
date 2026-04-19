import type { Participant, Prize } from '../types';

export const dummyParticipants: Participant[] = [
  { id: 1, name: "Ahmad Fauzi", department: "Jakarta", shopName: "Toko Berkah Utama", ktpNumber: "3273**********12", phoneNumber: "0812-3456-7890", address: "Jl. Merdeka No. 12, Jakarta" },
  { id: 2, name: "Siti Rahayu", department: "Bandung", shopName: "Sari Rasa Shop", ktpNumber: "3204**********45", phoneNumber: "0813-9876-5432", address: "Jl. Sudirman No. 45, Bandung" },
  { id: 3, name: "Budi Santoso", department: "Surabaya", shopName: "Budi Jaya Motor", ktpNumber: "3578**********89", phoneNumber: "0811-2233-4455", address: "Jl. Gajah Mada No. 8, Surabaya" },
  { id: 4, name: "Dewi Lestari", department: "Jogja", shopName: "Dewi Fashion", ktpNumber: "3471**********23", phoneNumber: "0819-0099-8877", address: "Jl. Malioboro No. 5, Jogja" },
  { id: 5, name: "Eko Prasetyo", department: "Semarang", shopName: "Eko Elektronik", ktpNumber: "3374**********56", phoneNumber: "0812-1122-3344", address: "Jl. Pandanaran No. 10, Semarang" },
  { id: 6, name: "Fitri Handayani", department: "Medan", shopName: "Fitri Mart", ktpNumber: "1271**********78" },
  { id: 7, name: "Gunawan Wibowo", department: "Palembang", shopName: "Gunawan Cell", ktpNumber: "1671**********11" },
  { id: 8, name: "Hana Pertiwi", department: "Makassar", shopName: "Hana Boutique", ktpNumber: "7371**********22" },
  { id: 9, name: "Irfan Hakim", department: "Daily", shopName: "Irfan Bakery", ktpNumber: "3171**********33" },
  { id: 10, name: "Joko Widodo", department: "Solo", shopName: "Solo Corner", ktpNumber: "3372**********44" },
  { id: 11, name: "Kartika Sari", department: "Malang", shopName: "Kartika Optik", ktpNumber: "3573**********55" },
  { id: 12, name: "Lukman Hakim", department: "Bekasi", shopName: "Lukman Variasi", ktpNumber: "3275**********66" },
  { id: 13, name: "Maya Indah", department: "Tangerang", shopName: "Maya Laundry", ktpNumber: "3671**********77" },
  { id: 14, name: "Nanda Putra", department: "Bogor", shopName: "Nanda Sport", ktpNumber: "3201**********88" },
  { id: 15, name: "Olivia Susanti", department: "Depok", shopName: "Olivia Petshop", ktpNumber: "3276**********99" },
  { id: 16, name: "Pandu Wijaya", department: "Sidoarjo", shopName: "Pandu Printing", ktpNumber: "3515**********00" },
  { id: 17, name: "Qori Amalia", department: "Gresik", shopName: "Qori Hijab", ktpNumber: "3525**********11" },
  { id: 18, name: "Rizky Pratama", department: "Denpasar", shopName: "Rizky Bali Shop", ktpNumber: "5171**********22" },
  { id: 19, name: "Sri Wahyuni", department: "Manado", shopName: "Sri Kelontong", ktpNumber: "7171**********33" },
  { id: 20, name: "Teguh Santoso", department: "Balikpapan", shopName: "Teguh Hardware", ktpNumber: "6471**********44" },
  { id: 21, name: "Umi Kalsum", department: "Pontianak", shopName: "Umi Cafe", ktpNumber: "6171**********55" },
  { id: 22, name: "Vino Bastian", department: "Banjarmasin", shopName: "Vino barbershop", ktpNumber: "6371**********66" },
  { id: 23, name: "Wulandari Putri", department: "Mataram", shopName: "Wulan Salon", ktpNumber: "5271**********77" },
  { id: 24, name: "Xander Kusuma", department: "Lampung", shopName: "Xander Resto", ktpNumber: "1871**********88" },
  { id: 25, name: "Yuni Astuti", department: "Pekanbaru", shopName: "Yuni Florist", ktpNumber: "1471**********99" },
];

export const dummyPrizes: Prize[] = [
  { id: 1, name: "Motor", description: "Hadiah Utama", value: "Kendaraan", imageUrl: "/dorprize-1.png" },
  { id: 2, name: "iPhone 17 Pro Max", description: "Hadiah Kedua", value: "Smartphone", imageUrl: "/dorprize-2.png" },
  { id: 3, name: "TV Android", description: "Hadiah Ketiga", value: "Elektronik", imageUrl: "/dorprize-3.png" },
];
