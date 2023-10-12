import Header from './components/header/header';
import Sidebar from './components/sidebar/sidebar';


const Layout = ({ children }) => {
    return (
    <React.Fragment>
        <Header />
        <div className="navigationWrapper">
            <Sidebar />
            <main>{children}</main>
        </div>
    </React.Fragment>
    );
};

export default Layout;