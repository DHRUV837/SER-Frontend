import { useSales } from "../../context/SalesContext";

const SalesChart = () => {
  const { deals } = useSales();

  const totalIncentive = deals.reduce((sum, d) => sum + d.incentive, 0);
  const avgDealValue = deals.length > 0 
    ? deals.reduce((sum, d) => sum + d.amount, 0) / deals.length 
    : 0;

  return (
    <div className="card-modern p-8 relative">
      <div className="absolute top-0 right-0 w-16 h-16 border-b border-r border-gray-200"></div>
      
      <div className="mb-6">
        <h2 className="section-title">Performance</h2>
        <div className="h-px bg-black w-24 mt-2"></div>
        <p className="section-subtitle mt-4">Overview & Metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-2 border-gray-200 p-6 group hover:border-black transition-colors">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">Total Deals</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-light text-gray-900">{deals.length}</p>
            <div className="h-px bg-gray-300 flex-1 mt-4 group-hover:bg-black transition-colors"></div>
          </div>
        </div>
        
        <div className="border-2 border-gray-200 p-6 group hover:border-black transition-colors">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">Total Rewards</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-light text-gray-900">₹{totalIncentive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
            <div className="h-px bg-gray-300 flex-1 mt-4 group-hover:bg-black transition-colors"></div>
          </div>
        </div>
        
        <div className="border-2 border-gray-200 p-6 group hover:border-black transition-colors">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">Avg Deal Value</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-light text-gray-900">₹{avgDealValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            <div className="h-px bg-gray-300 flex-1 mt-4 group-hover:bg-black transition-colors"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
