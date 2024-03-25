import React from 'react';
import styles from './PhoneMockup.module.css';

const PhoneMockup = ({ children }) => {
  return (
    <div className={styles.phoneFrame}>
      {/* Phone screen content goes here */}
      <div className={styles.phoneScreen}>{children}</div>
    </div>
  );
};

export default PhoneMockup;
