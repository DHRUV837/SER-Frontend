const StatusBadge = ({ status }) => {
  const statusConfig = {
    Draft: { 
      bg: "bg-gradient-to-r from-gray-100 to-gray-50", 
      text: "text-gray-700", 
      border: "border-gray-300",
      shadow: "shadow-sm"
    },
    Submitted: { 
      bg: "bg-gradient-to-r from-blue-100 to-blue-50", 
      text: "text-blue-700", 
      border: "border-blue-400",
      shadow: "shadow-sm"
    },
    Approved: { 
      bg: "bg-gradient-to-r from-emerald-100 to-green-50", 
      text: "text-emerald-700", 
      border: "border-emerald-400",
      shadow: "shadow-md"
    },
    Rejected: { 
      bg: "bg-gradient-to-r from-red-100 to-rose-50", 
      text: "text-red-700", 
      border: "border-red-400",
      shadow: "shadow-sm"
    },
  };

  const config = statusConfig[status] || statusConfig.Draft;

  return (
    <span className={`text-xs font-semibold uppercase tracking-widest px-3 py-1.5 border-2 rounded-sm ${config.bg} ${config.text} ${config.border} ${config.shadow}`}>
      {status}
    </span>
  );
};

export default StatusBadge;

