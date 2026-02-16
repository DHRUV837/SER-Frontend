import { ShieldCheck } from "lucide-react";

const RoleStep = ({ handleNext }) => {
    return (
        <div className="max-w-xl text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Roles Configured</h2>
            <p className="text-slate-400 mb-8">
                We have set up default <b>Admin</b> and <b>Sales Representative</b> roles for you with standard permissions.
                You can customize these later in Settings.
            </p>

            <button
                onClick={handleNext}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
            >
                Looks Good
            </button>
        </div>
    );
};

export default RoleStep;
