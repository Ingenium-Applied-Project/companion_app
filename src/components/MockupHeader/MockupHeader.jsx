import Image from 'next/image';
import styles from './MockupHeader.module.css';

function MockupHeader() {
  return (
    <div className={styles.mockupHeader}>
      <div className={styles.headerImage}>
        <Image
          src="/artifact-canadair.webp"
          alt="inSync Logo"
          width={350}
          height={200}
        />
      </div>
      <h2 className={styles.headerTitle}>Canadair Sabre</h2>
    </div>
  );
}

export default MockupHeader;
