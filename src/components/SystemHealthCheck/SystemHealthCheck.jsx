'use client';

import { useApp } from '@/providers/appProvider';
import React, { useEffect, useState } from 'react';
import styles from './SystemHealthCheck.module.css';

const SystemHealthCheck = () => {
  const {
    startSystemHealthCheck,
    systemHealthCheckData,
    systemHealthCheckRunning,
  } = useApp();

  const [formattedJSON, setFormattedJSON] = useState(null);

  useEffect(() => {
    if (systemHealthCheckData) {
      setFormattedJSON(JSON.stringify(systemHealthCheckData, null, 4));
    } else {
      setFormattedJSON(null);
    }
  }, [systemHealthCheckData, setFormattedJSON]);

  const handleSystemHealthClick = async () => {
    await startSystemHealthCheck();
  };

  return (
    <div>
      <p>System health check</p>
      <button
        onClick={handleSystemHealthClick}
        disabled={systemHealthCheckRunning}
      >
        {!systemHealthCheckRunning && 'Run System health check'}
        {systemHealthCheckRunning && 'System health check running'}
      </button>
      <div></div>
      <div>
        {formattedJSON && (
          <textarea
            className={styles.textarea}
            value={formattedJSON}
            onChange={() => {}}
          ></textarea>
        )}
      </div>
    </div>
  );
};

export default SystemHealthCheck;
