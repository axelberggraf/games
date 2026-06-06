import styles from "./page.module.css";
import GameCard from "@/components/ui/GameCard";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Mini Games</h1>
      </header>
      <main className={styles.main}>
        <p className={styles.subtitle}>Pick a game and start playing</p>
        <div className={styles.grid}>
          <GameCard
            href="/wordle"
            icon="🟩"
            title="Wordle"
            description=""
            cardBg="rgb(227, 227, 225)"
            subtitle="Guess the 5-letter word"
            date={date}
          />
          <GameCard
            href="/crossword"
            icon="✏️"
            title="Mini Crossword"
            description=""
            crossword
            subtitle="A 5×5 grid of clues"
            date={date}
          />
          {/* <GameCard
            href="/midi-crossword"
            icon="🖊️"
            title="Midi Crossword"
            description=""
            crossword
            subtitle="A bigger 7×7 challenge"
            date={date}
          /> */}
          <GameCard
            href="/connections"
            icon="🔗"
            title="Connections"
            description=""
            cardBg="rgb(180, 168, 255)"
            subtitle="Find the four groups"
            date={date}
          />
          {/* <GameCard
            href="/midi-connections"
            icon="🔗"
            title="Midi Connections"
            description=""
            cardBg="rgb(180, 168, 255)"
            subtitle="Find the six groups"
            date={date}
          /> */}
          <GameCard
            href="/mega-connections"
            icon="🔗"
            title="Mega Connections"
            description=""
            cardBg="rgb(180, 168, 255)"
            subtitle="Find the eight groups"
            date={date}
          />
          <GameCard
            href="/bandle"
            icon="🎵"
            title="Bandle"
            description=""
            cardBg="rgb(255, 220, 160)"
            subtitle="Medium (Par 3)"
            date={date}
          />
        </div>
      </main>
    </div>
  );
}
