import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/inSYNC_logo_transparent.png"
              alt="inSync Logo"
              style={{
                width: 'auto',
                height: '100%',
              }}
              width={100}
              height={300}
            />
          </Link>
        </div>
        <div className={styles.links}>
          <Link href="/about">About</Link>
          <Link href="/about/team">Our Team</Link>
          <Link href="/code/repos">Code</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
