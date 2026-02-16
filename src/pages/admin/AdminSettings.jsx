import { useState, useEffect } from "react";
import api from "../../api";
import AdminLayout from "../../layouts/AdminLayout";
import PageHeader from "../../components/common/PageHeader";

const AdminSettings = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get("/settings");
            setSettings(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch settings", error);
            setLoading(false);
        }
    };

    const handleChange = (key, newValue) => {
        setSettings(settings.map(s =>
            s.key === key ? { ...s, value: newValue } : s
        ));
        setHasChanges(true);
    };

    const handleSave = async () => {
        try {
            await api.post("/settings/bulk", settings);
            alert("Settings saved successfully!");
            setHasChanges(false);
        } catch (error) {
            alert("Failed to save settings");
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <PageHeader
                    heading="Platform Configuration"
                    subtitle="Manage global settings and system parameters."
                    actions={
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges}
                            className={`btn-primary ${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Save Changes
                        </button>
                    }
                />

                <div className="card-modern p-6">
                    <h3 className="font-bold text-lg mb-6 text-text-primary">General Configuration</h3>

                    {loading ? (
                        <p className="text-text-muted">Loading settings...</p>
                    ) : (
                        <div className="space-y-6">
                            {settings.map((setting) => (
                                <div key={setting.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-border-subtle pb-6 last:border-0 last:pb-0">
                                    <div className="md:col-span-1">
                                        <p className="font-semibold text-text-primary capitalize">{setting.key.replace(/_/g, ' ')}</p>
                                        <p className='text-sm text-text-muted'>{setting.description}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        {setting.key === 'maintenance_mode' ? (
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleChange(setting.key, setting.value === 'true' ? 'false' : 'true')}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${setting.value === 'true' ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${setting.value === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                                <span className="text-sm text-text-primary">{setting.value === 'true' ? 'Enabled' : 'Disabled'}</span>
                                            </div>
                                        ) : (
                                            <input
                                                type="text"
                                                value={setting.value}
                                                onChange={(e) => handleChange(setting.key, e.target.value)}
                                                className="input-modern w-full max-w-md"
                                            />
                                        )
                                        }
                                    </div >
                                </div >
                            ))}
                        </div >
                    )}
                </div >

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-amber-700 dark:text-amber-200">
                                Changing these settings affects the entire application immediately. Please proceed with caution.
                            </p>
                        </div>
                    </div>
                </div>
            </div >
        </AdminLayout >
    );
};

export default AdminSettings;
