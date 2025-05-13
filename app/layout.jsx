// app/layout.tsx or layout.js
import './globals.css';
import { Poppins, Figtree } from 'next/font/google';
import Navbar from './components/Navbar';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-poppins',
  display: 'swap',
});

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-figtree',
  display: 'swap',
});

export const metadata = {
  title: 'RLCS Predictions',
  description: 'Predict RLCS tournament outcomes',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} font-sans bg-gray-900 min-h-screen`}>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
