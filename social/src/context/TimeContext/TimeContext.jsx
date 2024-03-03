import React, { createContext, useState } from 'react';

// Creare il contesto
const TimeContext = createContext();

// Creare un provider del contesto
export const TimeProvider = ({ children }) => {
  const [updateInterval, setUpdateInterval] = useState(0);
  const [updateTimes, setUpdateTimes] = useState(0);

  return (
    <TimeContext.Provider value={{ updateInterval, setUpdateInterval, updateTimes, setUpdateTimes }}>
      {children}
    </TimeContext.Provider>
  );
}

export { TimeContext};