import React, {useState} from 'react'
import Header from '../components/header/Header';
import NewPost from './NewPost';
import Sidebar from '../components/sidebar/sidebar';
import { Outlet } from 'react-router-dom';
import './home.css';

function Home() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <div>
            <Header setModalOpen={setModalOpen} />
                <div className="main">
                    <Sidebar /> 
                    <NewPost modalOpen={modalOpen} setModalOpen={setModalOpen} />
                    <Outlet />
                </div>
            </div>
            <div>
                
            </div>
        </>
    );
};

export default Home;