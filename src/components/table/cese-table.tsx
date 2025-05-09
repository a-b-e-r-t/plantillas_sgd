"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface Usuario {
  id: string;
  nombre: string;
  fecha_fin: string | null;
}

interface UsuariosCeseTableProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
}

export default function UsuariosCeseTable({ usuarios, onEdit }: UsuariosCeseTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>(usuarios);

  useEffect(() => {
    const filtered = usuarios.filter(
      (usuario) =>
        usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (usuario.fecha_fin && format(new Date(usuario.fecha_fin), "PPP p").toLowerCase().includes(searchTerm.toLowerCase())) ||
        usuario.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsuarios(filtered);
    setCurrentPage(1);
  }, [searchTerm, usuarios]);

  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredUsuarios.length);
  const currentUsuarios = filteredUsuarios.slice(startIndex, endIndex);

  return (
    <div className="space-y-4 bg-card p-2 rounded-lg border border-border">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Input
          placeholder="Buscar por usuario, nombre o fecha..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
          <SelectTrigger className="w-[180px] border-border">
            <SelectValue placeholder="Items por página" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 por página</SelectItem>
            <SelectItem value="10">10 por página</SelectItem>
            <SelectItem value="20">20 por página</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table className="border border-border rounded-lg overflow-hidden">
        <TableHeader>
          <TableRow className="bg-popover">
            <TableHead>Nombre</TableHead>
            <TableHead>Fecha de cese</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead className="text-right">Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsuarios.map((usuario, index) => (
            <TableRow key={index}>
              <TableCell>{usuario.nombre}</TableCell>
              <TableCell>
                {usuario.fecha_fin ? format(new Date(usuario.fecha_fin), "PPP p") : "-"}
              </TableCell>
              <TableCell>{usuario.id}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full text-blue-500 hover:text-blue-600"
                    title="Modificar"
                    onClick={() => onEdit(usuario)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Modificar {usuario.nombre}</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Mostrando {startIndex + 1}-{Math.min(endIndex, filteredUsuarios.length)} de {filteredUsuarios.length}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            Página {currentPage} de {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}