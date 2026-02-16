import { Rocket } from "lucide-react";

const FirstActionStep = ({ handleNext }) => {
    return (
        <div className="max-w-xl text-center">
            <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Ready for Action</h2>
            <p className="text-slate-400 mb-8">
                Your environment is configured. As an Admin, you can now start creating deals and monitoring performance.
            </p>

            <button
                onClick={handleNext}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
            >
                Let's Go!
            </button>
        </div>
    );
};

export default FirstActionStep;
