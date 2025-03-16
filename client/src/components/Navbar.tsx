import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Package, 
  Users, 
  Calendar
} from 'lucide-react';

function Navbar(): React.ReactElement {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 font-bold text-xl">
            92S Rental
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink
                to="/orders"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Package className="inline-block mr-1 h-4 w-4" />
                Đơn hàng
              </NavLink>
              <NavLink
                to="/equipments"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Package className="inline-block mr-1 h-4 w-4" />
                Thiết bị
              </NavLink>
              <NavLink
                to="/customers"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Users className="inline-block mr-1 h-4 w-4" />
                Khách hàng
              </NavLink>
              <NavLink
                to="/calendar"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Calendar className="inline-block mr-1 h-4 w-4" />
                Lịch
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;