const AppIcon = ({ size = "w-10 h-10" }) => {
  return (
    <div 
      className={`${size} rounded-xl flex items-center justify-center shadow-xl relative overflow-hidden group hover:scale-105 transition-transform duration-200`}
      style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #0d9488 100%)'
      }}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent"></div>
      
      {/* Main icon - Currency symbol with star */}
      <div className="relative z-10 flex items-center justify-center">
        <svg 
          className="w-7 h-7 text-white drop-shadow-lg" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {/* Rupee symbol - bold and visible */}
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="3" 
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        
        {/* Star accent - more visible */}
        <svg 
          className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 text-yellow-300 drop-shadow-lg" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
    </div>
  );
};

export default AppIcon;

