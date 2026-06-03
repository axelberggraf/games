import ConnectionsGame from '@/components/connections/ConnectionsGame';
import { MIDI_PUZZLE } from '@/lib/connections/midi-data';

export const metadata = { title: 'Midi Connections — Mini Games' };

export default function MidiConnectionsPage() {
  return (
    <ConnectionsGame
      puzzle={MIDI_PUZZLE}
      title="Midi Connections"
      legendLabels={['Easy', 'Medium', 'Hard', 'Tricky', 'Challenging', 'Expert']}
    />
  );
}
