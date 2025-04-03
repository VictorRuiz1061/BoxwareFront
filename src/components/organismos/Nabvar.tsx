import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <Link to="/">Mi Proyecto</Link>
        </div>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-200">
            Inicio
          </Link>
          <Link to="/dashboard" className="text-white hover:text-gray-200">
            Dashboard
          </Link>
          <Link to="/perfil" className="text-white hover:text-gray-200">
            Perfil
          </Link>
          <Link to="/contacto" className="text-white hover:text-gray-200">
            Contacto
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;