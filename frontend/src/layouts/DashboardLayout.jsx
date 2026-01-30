import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

const DashboardLayout = ({ children, title }) => {
    return (
        <div className="bg-bg-light min-h-screen">
            <Sidebar />
            <div className="flex flex-col min-h-screen">
                <Navbar title={title} />
                <main className="ml-64 p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
