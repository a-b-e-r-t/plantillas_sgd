'use client';
import {
  Menu,
  Minus,
  Files,
  User,
  ChevronDown,
  ChevronUp,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUsuariosSubmenu, setShowUsuariosSubmenu] = useState(false);
  const [showDocumentosSubmenu, setShowDocumentosSubmenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleUsuariosSubmenu = () => setShowUsuariosSubmenu(!showUsuariosSubmenu);
  const toggleDocumentosSubmenu = () => setShowDocumentosSubmenu(!showDocumentosSubmenu);

  if (!mounted) return null;

  return (
    <>
      {/* Fondo oscuro solo en móvil y cuando el sidebar está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      <div
        className={`
          flex flex-col
          ${isOpen ? 'w-64' : 'w-16'}
          bg-card text-card-foreground
          transition-all duration-300 border-r border-border min-h-screen
          z-50
          ${isOpen ? 'fixed top-0 left-0 h-full md:static' : 'md:static'}
          ${isOpen ? 'shadow-lg' : ''}
        `}
      >
        <button
          onClick={toggleSidebar}
          className="p-4 text-muted-foreground hover:text-primary transition-all duration-300"
        >
          {isOpen ? (
            <X size={24} className="transition-all duration-300" />
          ) : (
            <Menu size={24} className="transition-all duration-300" />
          )}
        </button>

        {isOpen && (
          <nav className="flex flex-col space-y-4 mt-4">
            <ul>
              {/* Documentos */}
              <li className="relative">
                <button
                  onClick={toggleDocumentosSubmenu}
                  className="flex items-center justify-between w-full pr-2 text-muted-foreground hover:text-primary pl-6"
                >
                  <div className="flex items-center space-x-2">
                    <Files size={20} />
                    <span>Documentos</span>
                  </div>
                  {showDocumentosSubmenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {showDocumentosSubmenu && (
                  <ul className="ml-10 mt-2 space-y-1 text-sm">
                    <li>
                      <Link href="/dashboard/plantilla" className="block py-2 hover:text-primary pl-6">
                        <div className="flex items-center space-x-2">
                          <Minus size={16} />
                          <span>Plantillas</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/correlativo" className="block py-2 hover:text-primary pl-6">
                        <div className="flex items-center space-x-2">
                          <Minus size={16} />
                          <span>Correlativos</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/documento" className="block py-2 hover:text-primary pl-6">
                        <div className="flex items-center space-x-2">
                          <Minus size={16} />
                          <span>Documentos personales</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/registro" className="block py-2 hover:text-primary pl-6">
                        <div className="flex items-center space-x-2">
                          <Minus size={16} />
                          <span>Nuevo documento</span>
                        </div>
                      </Link>
                      <Link href="/dashboard/doc-verifica" className="block py-2 hover:text-primary pl-6">
                        <div className="flex items-center space-x-2">
                          <Minus size={16} />
                          <span>Verifica</span>
                        </div>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Cargos */}
              <li className="mt-4">
                <Link href="/dashboard/cargo" className="flex items-center space-x-2 w-full py-2 hover:text-primary text-muted-foreground pl-6">
                  <Users size={20} />
                  <span>Cargos</span>
                </Link>
              </li>

              {/* Usuarios */}
              <li className="relative mt-4">
                <button
                  onClick={toggleUsuariosSubmenu}
                  className="flex items-center justify-between w-full pr-2 text-muted-foreground hover:text-primary pl-6"
                >
                  <div className="flex items-center space-x-2">
                    <User size={20} />
                    <span>Usuarios</span>
                  </div>
                  {showUsuariosSubmenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {showUsuariosSubmenu && (
                  <ul className="ml-10 mt-2 space-y-1 text-sm">
                    <li>
                      <Link href="/dashboard/cese" className="block py-2 hover:text-primary pl-6">
                        <div className="flex items-center space-x-2">
                          <Minus size={16} />
                          <span>Cese</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/VistoBueno" className="block py-2 hover:text-primary pl-6">
                        <div className="flex items-center space-x-2">
                          <Minus size={16} />
                          <span>Visto bueno</span>
                        </div>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        )}
      </div>
    </>
  );
};

export default Sidebar;