import ConnectionsGame from '@/components/connections/ConnectionsGame';
import { PUZZLE } from '@/lib/connections/data';

export const metadata = { title: 'Connections — Mini Games' };

export default function ConnectionsPage() {
  return <ConnectionsGame puzzle={PUZZLE} title="Connections" />;
}
