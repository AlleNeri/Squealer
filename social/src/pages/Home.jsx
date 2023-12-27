import {useState} from 'react'
import Header from '../components/header/Header';
import NewPost from './NewPost';
import Sidebar from '../components/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import './home.css';

function Home() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Header setModalOpen={setModalOpen} />
            <Sidebar style={{ position:'fixed', marginTop:'800px'}}/> 
            <div style={{ paddingTop: '100px' }}>
                <div className='main'>
                    <NewPost modalOpen={modalOpen} setModalOpen={setModalOpen} />
                </div>
                <Outlet />
            </div>
        </>
    );
}

export default Home;
