import styles from './MockupGallery.module.css';

function MockupGallery({ children }) {
  return <div className={styles.imageGallery}>{children}</div>;
}

export default MockupGallery;
