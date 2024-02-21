// SidebarContext.js
import React, { createContext, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isSidebarMinimized, setSidebarMinimized] = useState(false);

  return (
    <SidebarContext.Provider value={{ isSidebarMinimized, setSidebarMinimized }}>
      {children}
    </SidebarContext.Provider>
  );
};