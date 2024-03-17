'use client';

import { useApp } from '@/providers/appProvider';
import React from 'react';

const SystemHealthCheck = () => {
  const { startSystemHealthCheck } = useApp();

  const handleSystemHealthClick = async () => {
    await startSystemHealthCheck();
  };

  return (
    <div>
      <p>System health check</p>
      <button onClick={handleSystemHealthClick}>Run System health check</button>
    </div>
  );
};

export default SystemHealthCheck;
