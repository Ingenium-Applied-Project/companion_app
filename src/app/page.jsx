import HeroImage from '@/components/HeroImage/HeroImage';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <HeroImage />
      <p>This is just a Test for CASM</p>
    </main>
  );
}
