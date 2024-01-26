import React, {useState, useEffect} from 'react';
import Header from '../Header/Header';
import NewPost from '../NewPost/NewPost';
import Sidebar from '../Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import './layout.css';

function Home() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="body">
            <Header className="top" setModalOpen={setModalOpen} />
            <Sidebar className="sidebar" /> 
            <div className="container">
                <div className="main" style={{ paddingTop: '100px' }}>
                    <NewPost modalOpen={modalOpen} setModalOpen={setModalOpen} />
                    <Outlet />
                </div>
            </div>
        </div>  
    );
}

export default Home;
