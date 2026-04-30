import type { Metadata } from 'next';
import { Inter, Montserrat, Poppins, Bebas_Neue } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const poppins = Poppins({ weight: ['400', '700', '900'], subsets: ['latin'], variable: '--font-poppins' });
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });

export const metadata: Metadata = {
  title: 'Whoisthewinners',
  description: 'Aplikasi undian untuk acara Anda',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${montserrat.variable} ${poppins.variable} ${bebasNeue.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
