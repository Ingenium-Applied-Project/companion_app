import styles from './MockupScreenLink.module.css';

function MockupScreenLink({ icon, title, line }) {
  if (line) {
    return (
      <div>
        <hr />
        <p className={styles.contentLocation}>
          <i className={`fas ${icon}`}></i> {title}
        </p>
        <hr />
      </div>
    );
  } else {
    return (
      <div>
        <p className={styles.contentLocation}>
          <i className={`fas ${icon}`}></i> {title}
        </p>
      </div>
    );
  }
}

export default MockupScreenLink;
