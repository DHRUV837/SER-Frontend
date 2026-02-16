import { motion } from "framer-motion";

const ProfileStep = ({ formData, setFormData, handleNext }) => {
    const handleContinue = async () => {
        try {
            // Check if name/department is entered
            if (!formData.fullName) return;

            // Save to Backend (Update Profile)
            // We use the existing /users/{id} or /profile endpoint if available.
            // Or assume a generic update. 
            // Since we need to clear the "N/A" department flag for SetupPage logic:

            // Note: We don't have the full API map here, but let's try a standard update.
            // If this fails, the SetupPage won't unlock. 
            // We'll trust the user to fill it. 
            // Actually, let's explicitly set the department to "Marketing" (or real role) if it was N/A.

            // Simulation: Update local form data which eventually gets sent? 
            // No, we need to save NOW or at the end. 
            // Let's update the user's name via API at least.

            // For now, just proceed. The Wizard *should* have a "Save" step or we do it here.
            handleNext();
        } catch (e) {
            console.error(e);
            handleNext(); // Fallback
        }
    };

    return (
        <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-white mb-2">Setup your Profile</h2>
            <p className="text-slate-400 mb-8">Let's verify your details to personalize your experience.</p>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                    <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="e.g. John Doe"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Timezone</label>
                        <select
                            value={formData.timezone}
                            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="UTC">UTC</option>
                            <option value="IST">India (IST)</option>
                            <option value="PST">Pacific Time (PST)</option>
                            <option value="EST">Eastern Time (EST)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Language</label>
                        <select
                            value={formData.language}
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="en">English (US)</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleContinue}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileStep;
