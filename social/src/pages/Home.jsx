import React from 'react'
import Header from '../components/header/header';
import Sidebar from '../components/sidebar/sidebar';
import { Outlet } from 'react-router-dom';
import './home.css';

function Home() {
    return (
        <>
            <div>
                <Header />
                
                <div class="main">
                    <Sidebar />
                    <Outlet />
                </div>
            </div>
        </>   
    );
};

export default Home;