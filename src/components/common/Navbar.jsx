import { NavLink } from "react-router-dom";
import AppIcon from "./AppIcon";

function Navbar() {
  return (
    <nav className="border-b-2 border-primary-200 px-8 py-5 flex justify-between bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/30 relative shadow-sm">
      <div className="absolute top-0 left-0 w-32 h-full border-r-2 border-primary-200"></div>

      <div className="flex items-center space-x-3 pl-36">
        <AppIcon size="w-10 h-10" />
        <h1 className="font-semibold text-lg uppercase tracking-widest" style={{
          background: 'linear-gradient(to right, #1e40af, #0d9488)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Sales Reward Engine
        </h1>
      </div>

      <div className="flex gap-8 text-sm">
        <NavLink to="/" className={({ isActive }) =>
          `uppercase tracking-widest transition-all relative ${isActive ? "text-primary-700 font-semibold" : "text-gray-600 hover:text-primary-600"
          }`
        }>
          {({ isActive }) => (
            <>
              Dashboard
              {isActive && <div className="absolute -bottom-5 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></div>}
            </>
          )}
        </NavLink>

        <NavLink to="/sales/simulator" className={({ isActive }) =>
          `uppercase tracking-widest transition-all relative ${isActive ? "text-primary-700 font-semibold" : "text-gray-600 hover:text-primary-600"
          }`
        }>
          {({ isActive }) => (
            <>
              Simulator
              {isActive && <div className="absolute -bottom-5 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></div>}
            </>
          )}
        </NavLink>

        <NavLink to="/history" className={({ isActive }) =>
          `uppercase tracking-widest transition-all relative ${isActive ? "text-primary-700 font-semibold" : "text-gray-600 hover:text-primary-600"
          }`
        }>
          {({ isActive }) => (
            <>
              Deal History
              {isActive && <div className="absolute -bottom-5 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></div>}
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
