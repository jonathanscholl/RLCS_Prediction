// app/layout.tsx or layout.js
import './globals.css';
import { Poppins, Figtree } from 'next/font/google';

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
  title: 'My App',
  description: 'Using Poppins with Tailwind',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} font-sans`}>{children}</body>
    </html>
  );
}
