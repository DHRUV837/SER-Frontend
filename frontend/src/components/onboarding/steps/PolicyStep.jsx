import { FileText } from "lucide-react";

const PolicyStep = ({ handleNext }) => {
    return (
        <div className="max-w-xl text-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Incentive Policy</h2>
            <p className="text-slate-400 mb-8">
                A "Standard Sales Commission" policy has been created for you (5% on all deals).
                You can add complex logic later.
            </p>

            <button
                onClick={handleNext}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
            >
                Confirm Policy
            </button>
        </div>
    );
};

export default PolicyStep;
