import AdminLayout from "../../layouts/AdminLayout";

const AdminPlaceholder = ({ title }) => {
    return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-in fade-in duration-500">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-4 rounded-full">
                    <span className="text-4xl">🚧</span>
                </div>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                        {title}
                    </h1>
                    <p className="text-text-secondary mt-2 text-lg">
                        This advanced capability is scheduled for a future release cycle.
                    </p>
                </div>
                <div className="w-full max-w-md bg-surface-2 h-2 rounded-full overflow-hidden mt-8">
                    <div className="h-full bg-primary-500 w-1/3 animate-pulse"></div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminPlaceholder;
