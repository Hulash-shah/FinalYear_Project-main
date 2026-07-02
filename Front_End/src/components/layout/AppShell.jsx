import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { GlobalStyle } from '../../theme/globalStyles';
import { C } from '../../theme/colors';

const AppShell = ({ children, activePage, setActivePage, user, onLogout, isDark, toggleTheme }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: C.bg,
        fontFamily: "'DM Sans', sans-serif"
      }}
    >
      <GlobalStyle/>
      <Sidebar
        active={activePage}
        setActive={setActivePage}
        user={user}
        onLogout={onLogout}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar page={activePage} user={user} isDark={isDark} toggleTheme={toggleTheme} setActivePage={setActivePage} />
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppShell;