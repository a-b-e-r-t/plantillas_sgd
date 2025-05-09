"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

interface Cargo {
  ccar_descar: string;
  ccar_est_car: string;
  ccar_co_cargo: string;
}

interface CargoTableProps {
  cargos: Cargo[];
  onEdit: (document: Cargo) => void;
  onDelete: (document: Cargo) => void;
}

export default function CargosTable({ cargos, onEdit, onDelete }: CargoTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState<Cargo[]>(cargos);

  useEffect(() => {
    const filtered = cargos.filter(
      (document) =>
        document.ccar_descar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.ccar_est_car.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.ccar_co_cargo.includes(searchTerm)
    );
    setFilteredDocuments(filtered);
    setCurrentPage(1);
  }, [searchTerm, cargos]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredDocuments.length);
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

  return (
    <div className="space-y-4 bg-card p-2 rounded-lg border border-border">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Input
          placeholder="Buscar..."
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
            <TableHead>Nombre del cargo</TableHead>
            <TableHead>Estado del cargo</TableHead>
            <TableHead>Código del cargo</TableHead>
            <TableHead className="text-right">Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentDocuments.map((document, index) => (
            <TableRow key={index}>
              <TableCell>{document.ccar_descar}</TableCell>
              <TableCell>{document.ccar_est_car}</TableCell>
              <TableCell>{document.ccar_co_cargo}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full text-blue-500 hover:text-blue-600"
                    title="Modificar"
                    onClick={() => onEdit(document)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Modificar {document.ccar_descar}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full text-red-500 hover:text-red-600"
                    title="Eliminar"
                    onClick={() => onDelete(document)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar {document.ccar_descar}</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Mostrando {startIndex + 1}-{Math.min(endIndex, filteredDocuments.length)} de {filteredDocuments.length}
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
