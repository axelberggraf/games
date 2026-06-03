import MegaConnectionsGame from '@/components/connections/MegaConnectionsGame';
import { MEGA_PUZZLE } from '@/lib/connections/mega-data';

export const metadata = { title: 'Mega Connections — Mini Games' };

export default function MegaConnectionsPage() {
  return <MegaConnectionsGame puzzle={MEGA_PUZZLE} title="Mega Connections" />;
}
