import { Users } from "lucide-react";

const TeamStep = ({ handleNext }) => {
    return (
        <div className="max-w-xl text-center">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Invite Your Team</h2>
            <p className="text-slate-400 mb-8">
                You can invite your sales representatives now or later from the User Management dashboard.
            </p>

            <div className="flex gap-4">
                <button
                    onClick={handleNext}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all"
                >
                    Skip for Now
                </button>
                <button
                    onClick={handleNext}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default TeamStep;
