import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className=" text-xl font-bold  transition-colors duration-300">
            📚 BookLibrary
          </Link>
          <ul className="flex space-x-8">
            <li>
              <Link 
                to="/" 
                className={` font-medium px-3 py-2 rounded-md transition-all duration-300 relative ${
                  location.pathname === '/' 
                    ? 'bg-white bg-opacity-20' 
                    : 'hover:bg-white hover:bg-opacity-10 hover:transform hover:-translate-y-0.5'
                }`}
              >
                Home
                {location.pathname === '/' && (
                  <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></span>
                )}
              </Link>
            </li>
            <li>
              <Link 
                to="/wishlist" 
                className={` font-medium px-3 py-2 rounded-md transition-all duration-300 relative ${
                  location.pathname === '/wishlist' 
                    ? 'bg-white bg-opacity-20' 
                    : 'hover:bg-white hover:bg-opacity-10 hover:transform hover:-translate-y-0.5'
                }`}
              >
                Wishlist
                {location.pathname === '/wishlist' && (
                  <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
