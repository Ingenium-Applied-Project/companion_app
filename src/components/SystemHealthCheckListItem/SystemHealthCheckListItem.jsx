'use client';

import React from 'react';
import styles from './SystemHealthCheckListItem.module.css';

const SystemHealthCheckListItem = ({ data = null }) => {
  const { name, title, screenEditUrl, screenViewUrl, healthReport } = data;
  return (
    <div className={`${styles.container}`}>
      {/* Screen name */}
      <p className={`${styles.label} ${styles.screenNameLabel}`}>
        Screen name:
      </p>
      <p className={`${styles.value} ${styles.screenNameValue}`}>{name}</p>

      {/* Screen title */}
      <p className={`${styles.label} ${styles.screenTitleLabel}`}>
        Screen title:
      </p>
      <p className={`${styles.value} ${styles.screenTitleValue}`}>{title}</p>

      {/* Screen view Url */}
      <p className={`${styles.label} ${styles.screenViewUrlLabel}`}>
        View URL:
      </p>

      <a
        href={screenViewUrl}
        className={`${styles.a}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {screenViewUrl}
      </a>

      {/* Screen edit Url */}
      <p className={`${styles.label} ${styles.screenEditUrlLabel}`}>
        Edit URL:
      </p>
      <a
        href={screenEditUrl}
        className={`${styles.a}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {screenEditUrl}
      </a>

      {/* Issues */}
      <p className={`${styles.label} ${styles.screenProblemLabel}`}>
        Problems:
      </p>
      <ul className={`${styles.value} ${styles.screenProblemValue}`}>
        {healthReport &&
          Array.isArray(healthReport) &&
          healthReport.map((report) => {
            const {
              severity = '',
              description = '',
              suggestion = '',
              key = 0,
            } = report;
            return (
              <li className={`${styles.li}`} key={key}>
                {description}
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default SystemHealthCheckListItem;
