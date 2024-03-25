import styles from './MockupContent.module.css';

function MockupContent({ children }) {
  return <div className={styles.contentRow}>{children}</div>;
}

export default MockupContent;
