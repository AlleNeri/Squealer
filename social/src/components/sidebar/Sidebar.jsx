import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';


const Sidebar = () => {
    return (
      <div style={{ position: 'fixed', display: 'flex', justifyContent: 'flex-start', height: '100vh', marginTop:'64px' }}>
          <CDBSidebar textColor="#fff" backgroundColor="#333">
            <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
              <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
                Sidebar
              </a>
            </CDBSidebarHeader>
    
            <CDBSidebarContent className="sidebar-content">
              <CDBSidebarMenu>
                <NavLink to="/" activeclassname="activeClicked">
                  <CDBSidebarMenuItem >Channel1</CDBSidebarMenuItem>
                </NavLink>
                <NavLink to="/tables" activeclassname="activeClicked">
                  <CDBSidebarMenuItem >Channel2</CDBSidebarMenuItem>
                </NavLink>
                <NavLink to="/profile" activeclassname="activeClicked">
                  <CDBSidebarMenuItem>Channel3</CDBSidebarMenuItem>
                </NavLink>
                <NavLink to="/analytics" activeclassname="activeClicked">
                  <CDBSidebarMenuItem >Channel4</CDBSidebarMenuItem>
                </NavLink>
              </CDBSidebarMenu>
            </CDBSidebarContent>
    
            <CDBSidebarFooter style={{ textAlign: 'center' }}>
              <div
                style={{
                  padding: '20px 5px',
                }}
              >
              </div>
            </CDBSidebarFooter>
          </CDBSidebar>
        </div>
      );
};

export default Sidebar;
