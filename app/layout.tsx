import type { Metadata, Viewport } from 'next';
import { Geist, Roboto_Slab } from 'next/font/google';
import './theme.css';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const robotoSlab = Roboto_Slab({ subsets: ['latin'], variable: '--font-slab' });

export const metadata: Metadata = {
  title: 'Mini Games',
  description: 'Wordle, Mini Crossword, and Connections',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${robotoSlab.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `document.body.setAttribute('data-js','1');` }} />
        {children}
      </body>
    </html>
  );
}
