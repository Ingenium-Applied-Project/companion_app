import Image from 'next/image';
import styles from './MockupHeader.module.css';

function MockupHeader({ image, alt, title }) {
  return (
    <div className={styles.mockupHeader}>
      <div className={styles.headerImage}>
        <Image src={image} alt={alt} width={350} height={200} />
      </div>
      <h2 className={styles.headerTitle}>{title}</h2>
    </div>
  );
}

export default MockupHeader;
