import { useState } from "react";
import { User, Mail, Phone, Camera, Upload } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const IdentityStep = ({ formData, setFormData, handleNext }) => {
    const { auth } = useAuth();
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                // In a real app, we'd upload this file here or store it in formData
                setFormData({ ...formData, profilePhoto: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const isNextDisabled = !formData.fullName || !formData.mobile;

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Personal Identity</h2>
                <p className="text-slate-400">Let's start with the basics. Your identity helps us secure your account.</p>
            </div>

            <div className="space-y-8">
                {/* Photo Upload */}
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden">
                            {preview || formData.profilePhoto ? (
                                <img src={preview || formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-slate-500" />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-500 transition-colors shadow-lg">
                            <Camera className="w-4 h-4 text-white" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                    <div>
                        <h3 className="text-white font-medium">Profile Photo</h3>
                        <p className="text-sm text-slate-500">Max 2MB. JPG or PNG.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Full Name <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                    </div>

                    {/* Email (Read Only) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Work Email <span className="text-emerald-500 text-xs ml-1">(Verified)</span></label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="email"
                                value={auth?.user?.email || "user@company.com"}
                                disabled
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-400 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Mobile Number <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                    <button
                        onClick={handleNext}
                        disabled={isNextDisabled}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                        Continue to Role Setup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IdentityStep;
