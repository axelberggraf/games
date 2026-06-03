import Link from 'next/link';
import styles from './GameCard.module.css';

interface Props {
  href: string;
  icon: string;
  title: string;
  description: string;
  cardBg?: string;
  crossword?: boolean;
  subtitle?: string;
  date?: string;
}

function CrosswordGridIcon() {
  return (
    <svg width="51" height="51" viewBox="0 0 51 51" aria-hidden="true" className={styles.gridSvg}>
      <rect width="51" height="51" fill="white" />
      <rect x="11" y="11" width="9" height="9" fill="black" />
      <rect x="31" y="11" width="9" height="9" fill="black" />
      <rect x="11" y="31" width="9" height="9" fill="black" />
      <rect x="31" y="31" width="9" height="9" fill="black" />
      <rect x="0.5" y="0.5" width="50" height="50" fill="none" stroke="black" strokeWidth="1" />
      <line x1="10.5" y1="0.5" x2="10.5" y2="50.5" stroke="black" strokeWidth="1" />
      <line x1="20.5" y1="0.5" x2="20.5" y2="50.5" stroke="black" strokeWidth="1" />
      <line x1="30.5" y1="0.5" x2="30.5" y2="50.5" stroke="black" strokeWidth="1" />
      <line x1="40.5" y1="0.5" x2="40.5" y2="50.5" stroke="black" strokeWidth="1" />
      <line x1="0.5" y1="10.5" x2="50.5" y2="10.5" stroke="black" strokeWidth="1" />
      <line x1="0.5" y1="20.5" x2="50.5" y2="20.5" stroke="black" strokeWidth="1" />
      <line x1="0.5" y1="30.5" x2="50.5" y2="30.5" stroke="black" strokeWidth="1" />
      <line x1="0.5" y1="40.5" x2="50.5" y2="40.5" stroke="black" strokeWidth="1" />
    </svg>
  );
}

export default function GameCard({ href, icon, title, description, cardBg, crossword, subtitle, date }: Props) {
  const isStyled = crossword || !!cardBg;

  if (isStyled) {
    return (
      <Link
        href={href}
        className={`${styles.card} ${crossword ? styles.crosswordCard : styles.coloredCard}`}
        style={cardBg ? { background: cardBg } : undefined}
      >
        <div className={styles.cardTop}>
          <div className={styles.cardText}>
            <span className={styles.cardTitle}>{title}</span>
            {subtitle && <span className={styles.cardSubtitle}>{subtitle}</span>}
          </div>
          {crossword
            ? <CrosswordGridIcon />
            : <span className={styles.cardIcon}>{icon}</span>
          }
        </div>
        {date && <span className={styles.cardDate}>{date}</span>}
      </Link>
    );
  }

  return (
    <Link href={href} className={styles.card}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.title}>{title}</span>
      <span className={styles.description}>{description}</span>
      <span className={styles.cta}>Play →</span>
    </Link>
  );
}
