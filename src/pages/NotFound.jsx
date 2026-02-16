import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="card-modern p-12 relative">
          <div className="absolute top-0 left-0 w-16 h-16 border-b border-r border-gray-200"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-t border-l border-gray-200"></div>
          
          <div className="mb-8">
            <h1 className="text-7xl font-light text-gray-900 mb-2 tracking-tight">404</h1>
            <div className="h-px bg-black w-16 mx-auto"></div>
          </div>
          
          <h2 className="section-title mb-4">Page Not Found</h2>
          <p className="text-sm text-gray-600 mb-8 max-w-xs mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <button
            onClick={() => navigate("/sales")}
            className="btn-primary text-sm uppercase tracking-widest"
          >
            Go to Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

