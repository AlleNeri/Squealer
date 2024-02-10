import React, {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import NewPost from '../NewPost/NewPost';
import Sidebar from '../Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { SidebarContext } from '../../context/SidebarContext/SidebarContext';
import './layout.css';

function Home() {
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const { isSidebarMinimized } = useContext(SidebarContext);

    const mainStyle = {
        marginLeft: isSidebarMinimized ? '0' : '200px', // Adjust this value as needed
        paddingTop: '100px',
    };

    const sidebarStyle = {
        width: isSidebarMinimized ? '80px' : '375px', // Adjust this value as needed
    };

    useEffect(() => {
        navigate('/HomePage')
    }, []);

    return (
        <div className="body">
            <Header className="top" setModalOpen={setModalOpen} />
            <Sidebar className="sidebar" style={sidebarStyle} /> 
                <div className="main" style={mainStyle}>
                    <NewPost modalOpen={modalOpen} setModalOpen={setModalOpen} />
                    <Outlet />
                </div>
        </div>  
    );
}

export default Home;
