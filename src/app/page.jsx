import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Home Page</h1>
      <ul>
        <li className={styles.link}>
          <Link href="/hero-image">Hero Image</Link>
        </li>
        <li className={styles.link}>
          <Link href="/check-list">Check List</Link>
        </li>
        <li className={styles.link}>
          <Link href="/filename-generator">Filename Generator</Link>
        </li>
        <li className={styles.link}>
          <Link href="/multiple-size-image">Multiple Size Image</Link>
        </li>
        <li className={styles.link}>
          <Link href="/health-check">Health Check</Link>
        </li>
      </ul>
    </main>
  );
}
