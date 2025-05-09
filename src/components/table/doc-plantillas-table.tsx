import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes"; 

interface Document {
  cdoc_indbaj: string;
  label: string;
  value: string;
}

interface DocumentTableProps {
  documents: Document[];
  onEdit: (document: Document) => void;
}

export default function PlantillasTable({ documents, onEdit }: DocumentTableProps) {
  const { theme } = useTheme(); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);

  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const [updatedLabel, setUpdatedLabel] = useState<string>('');
  const [updatedEstado, setUpdatedEstado] = useState<string>('0'); 

  useEffect(() => {
    const filtered = documents.filter(
      (doc) =>
        doc.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDocuments(filtered);
    setCurrentPage(1);
  }, [searchTerm, documents]);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

  const renderEstado = (estado: string) => {
    if (estado === "1") {
      return (
        <span className="text-red-500 font-medium">Inactivo</span>
      );
    }
    return (
      <span className="text-green-500 font-medium">Activo</span>
    );
  };

  const openModal = (document: Document) => {
    setSelectedDocument(document);
    setUpdatedLabel(document.label); 
    setUpdatedEstado(document.cdoc_indbaj); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedLabel(e.target.value.toUpperCase()); 
  };

  const handleEstadoChange = (value: string) => {
    setUpdatedEstado(value); 
  };

  const handleSaveChanges = () => {
    if (selectedDocument && (updatedLabel !== selectedDocument.label || updatedEstado !== selectedDocument.cdoc_indbaj)) {
      const updatedDocument = {
        ...selectedDocument,
        label: updatedLabel,
        cdoc_indbaj: updatedEstado,
      };

      onEdit(updatedDocument);
      closeModal(); 
    }
  };

  return (
    <div className="space-y-4 bg-card p-4 rounded-lg border border-border">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Input
          placeholder="Buscar plantilla..."
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
            <TableHead className="w-[100px]">Código</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentDocuments.map((document, index) => (
            <TableRow key={`${document.label || 'default'}-${document.value || 'default'}-${index}`}>
              <TableCell className="font-medium">{document.value || 'Sin código'}</TableCell>
              <TableCell>{document.label || 'Sin descripción'}</TableCell>
              <TableCell>{renderEstado(document.cdoc_indbaj || 'Sin estado')}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    title="Modificar"
                    onClick={() => openModal(document)} 
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Modificar {document.label}</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
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

      {isModalOpen && selectedDocument && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
          <div className={`p-6 rounded-lg shadow-lg max-w-md w-full ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <h2 className="text-xl font-semibold mb-4">Modificar Plantilla</h2>
            <div>
              <p className="font-medium">Descripción:</p>
              <Input
                value={updatedLabel}
                onChange={handleLabelChange}
                placeholder="Descripción"
                autoFocus
              />
            </div>
            <div className="mt-4">
              <p className="font-medium">Estado:</p>
              <Select
                value={updatedEstado} 
                onValueChange={handleEstadoChange} 
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Activo</SelectItem>
                  <SelectItem value="1">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={closeModal}>Cerrar</Button>
              <Button
                onClick={handleSaveChanges} 
                disabled={updatedLabel === selectedDocument?.label && updatedEstado === selectedDocument?.cdoc_indbaj}
              >
                Guardar cambios
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
