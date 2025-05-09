'use client';
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Files,
  User,
  ChevronDown,
  ChevronUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
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
    <div
      className={`flex flex-col ${isOpen ? 'w-64' : 'w-16'} 
        bg-card text-card-foreground 
        transition-all duration-300 border-r border-border`}
    >
      <button onClick={toggleSidebar} className="p-2 text-muted-foreground dark:text-white">
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      <nav className="flex flex-col space-y-4 mt-4">
        <ul>
          {/* Documentos */}
          <li className="relative">
            <button
              onClick={toggleDocumentosSubmenu}
              className="flex items-center justify-between w-full pr-2 text-muted-foreground dark:text-white hover:text-primary"
            >
              <div className="flex items-center space-x-2">
                <Files size={30} />
                {isOpen && <span>Documentos</span>}
              </div>
              {isOpen && (showDocumentosSubmenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
            </button>
            {isOpen && showDocumentosSubmenu && (
              <ul className="ml-10 mt-2 space-y-1 text-sm">
                <li>
                  <Link href="/dashboard/plantilla" className="block py-2 text-muted-foreground dark:text-white hover:text-primary">
                    <div className="flex items-center space-x-2">
                      <Minus size={20} />
                      {isOpen && <span>Plantillas</span>}
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/correlativo" className="block py-2 text-muted-foreground dark:text-white hover:text-primary">
                    <div className="flex items-center space-x-2">
                      <Minus size={20} />
                      {isOpen && <span>Correlativos</span>}
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/documento" className="block py-2 text-muted-foreground dark:text-white hover:text-primary">
                    <div className="flex items-center space-x-2">
                      <Minus size={20} />
                      {isOpen && <span>Documentos personales</span>}
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/registro" className="block py-2 text-muted-foreground dark:text-white hover:text-primary">
                    <div className="flex items-center space-x-2">
                      <Minus size={20} />
                      {isOpen && <span>Nuevo documento</span>}
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <br />

          {/* Cargos */}
          <li>
            <Link href="/dashboard/cargo" className="flex items-center space-x-2 text-muted-foreground dark:text-white hover:text-primary px-2 py-2">
              <Users size={30} />
              {isOpen && <span>Cargos</span>}
            </Link>
          </li>

          <br />

          {/* Usuarios */}
          <li className="relative">
            <button
              onClick={toggleUsuariosSubmenu}
              className="flex items-center justify-between w-full pr-2 text-muted-foreground dark:text-white hover:text-primary"
            >
              <div className="flex items-center space-x-2">
                <User size={30} />
                {isOpen && <span>Usuarios</span>}
              </div>
              {isOpen && (showUsuariosSubmenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
            </button>
            {isOpen && showUsuariosSubmenu && (
              <ul className="ml-10 mt-2 space-y-1 text-sm">
                <li>
                  <Link href="/dashboard/cese" className="block py-2 text-muted-foreground dark:text-white hover:text-primary">
                    <div className="flex items-center space-x-2">
                      <Minus size={20} />
                      {isOpen && <span>Cese</span>}
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/VistoBueno" className="block py-2 text-muted-foreground dark:text-white hover:text-primary">
                    <div className="flex items-center space-x-2">
                      <Minus size={20} />
                      {isOpen && <span>Visto bueno</span>}
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
