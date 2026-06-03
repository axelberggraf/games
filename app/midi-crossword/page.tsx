import CrosswordGame from '@/components/crossword/CrosswordGame';
import { MIDI_PUZZLE } from '@/lib/crossword/midi-data';

export const metadata = { title: 'Midi Crossword — Mini Games' };

export default function MidiCrosswordPage() {
  return <CrosswordGame puzzle={MIDI_PUZZLE} title="Midi Crossword" />;
}
