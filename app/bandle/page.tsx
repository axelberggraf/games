import type { Metadata } from 'next';
import BandleGame from '@/components/bandle/BandleGame';

export const metadata: Metadata = { title: 'Bandle' };

export default function BandlePage() {
  return <BandleGame />;
}
