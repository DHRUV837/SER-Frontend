import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="card-modern p-12 relative">
          <div className="absolute top-0 left-0 w-16 h-16 border-b border-r border-gray-200"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-t border-l border-gray-200"></div>
          
          <div className="w-20 h-20 border-2 border-black flex items-center justify-center mx-auto mb-8 relative group">
            <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="absolute inset-0 border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 -translate-y-1"></div>
          </div>
          
          <h1 className="section-title mb-3">Access Denied</h1>
          <p className="text-sm text-gray-600 mb-8 max-w-xs mx-auto">
            You don't have permission to access this page. Please contact your administrator.
          </p>
          
          <button
            onClick={() => navigate("/login")}
            className="btn-primary text-sm uppercase tracking-widest"
          >
            Go to Login →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

