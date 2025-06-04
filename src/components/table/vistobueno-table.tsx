import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import type { VistoBueno,Empleado } from "@/actions/approval";
import { Edit, Trash, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useTheme } from "next-themes";

interface Props {
  data: VistoBueno[];
  onEdit: (item: VistoBueno) => void;
  onDelete: (item: VistoBueno) => void;
  onGetTrabajadores: (co_dependencia: string) => void;
  trabajadores: Empleado[];
}

export default function VistoBuenoTable({ data, onEdit, onDelete, onGetTrabajadores,trabajadores}: Props) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<VistoBueno[]>(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<VistoBueno | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VistoBueno | null>(null);
  const [updatedIndicador, setUpdatedIndicador] = useState<string>("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTrabajadorId, setSelectedTrabajadorId] = useState<string>("");

  useEffect(() => {
    const filtered = data.filter((item) =>
      (item.de_dependencia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cdes_user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.in_vb === "1" ? "CON VISTO" : "SIN VISTO").toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? dateStr
      : date.toLocaleDateString("es-PE", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const openModal = (item: VistoBueno) => {

    setSelectedItem(item);
    setUpdatedIndicador(item.in_vb);
    setIsModalOpen(true);
    setSelectedTrabajadorId(item.co_emp_vb || ""); 
    if (onGetTrabajadores) {
      onGetTrabajadores(item.co_dependencia);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setUpdatedIndicador("");
  };

  const handleDeleteClick = (item: VistoBueno) => {
    setItemToDelete(item);
    setShowConfirm(true);
    setTimeout(() => setIsModalVisible(true), 50);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setIsModalVisible(false);
      setTimeout(() => {
        setTimeout(() => {
          onDelete(itemToDelete);
          setShowConfirm(false);
          setItemToDelete(null);
          setIsModalVisible(false);
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
        }, 200);
      }, 200);
    }
  };

  const cancelDelete = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setShowConfirm(false);
      setItemToDelete(null);
    }, 200);
  };

  const handleSaveChanges = () => {
    if (!selectedItem) return;

    const updatedItem: VistoBueno = {
      ...selectedItem,
      in_vb: updatedIndicador,
      co_emp_vb: selectedTrabajadorId, 
    };
      onEdit(updatedItem);
      closeModal();
    
  };


  return (
    <div className="space-y-4 bg-card p-4 rounded-lg border border-border">
      {/* Toast de éxito */}
      {showSuccessMessage && (
        <div className={`fixed top-4 left-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform min-w-[300px] ${showSuccessMessage ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          } ${theme === "dark" ? "bg-gray-800 text-white border border-gray-700" : "bg-white text-gray-900 border border-gray-200"
          }`}>
          <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full flex-shrink-0">
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-sm">Correcto</p>
            <p className="text-xs opacity-80">Acción realizada correctamente.</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4 gap-4">
        <Input
          placeholder="Buscar por dependencia, empleado o indicador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md"
        />
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => setItemsPerPage(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Items por página" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 por página</SelectItem>
            <SelectItem value="10">10 por página</SelectItem>
            <SelectItem value="20">20 por página</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-popover">
            <TableHead>Código dependencia</TableHead>
            <TableHead>Código empleado VB</TableHead>
            <TableHead>Indicador VB</TableHead>
            <TableHead>Fecha visto bueno</TableHead>
            <TableHead>Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPageData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No hay datos de visto bueno.
              </TableCell>
            </TableRow>
          ) : (
            currentPageData.map((item, idx) => (
              <TableRow key={`${item.nu_emi}-${idx}`}>
                <TableCell>{item.de_dependencia}</TableCell>
                <TableCell>{item.cdes_user}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-white ${item.in_vb === "1" ? "bg-green-500" : "bg-red-500"}`}
                  >
                    {item.in_vb === "1" ? "CON VISTO" : "SIN VISTO"}
                  </span>
                </TableCell>
                <TableCell>{formatDate(item.fe_vb)}</TableCell>
                <TableCell>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className={`rounded-full ${item.in_vb === "0" ? "opacity-50 cursor-not-allowed" : "text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"}`}
                      title={item.in_vb === "0" ? "No se puede editar a CON VISTO" : "Editar"}
                      onClick={() => openModal(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                      title="Eliminar"
                      onClick={() => handleDeleteClick(item)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Modal de confirmación para eliminar con animaciones suaves */}
      {showConfirm && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-200 ease-out ${isModalVisible ? 'bg-black bg-opacity-50' : 'bg-black bg-opacity-0'}`}
        >
          <div
            className={`p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 transition-all duration-200 ease-out transform ${isModalVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2'} ${theme === "dark" ? "bg-gray-800 text-white border border-gray-700" : "bg-white text-gray-900 border border-gray-200"}`}
          >
            <div className="text-center">
              <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${theme === "dark" ? "bg-red-900/20" : "bg-red-100"}`}>
                <Trash className={`h-6 w-6 ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Confirmar eliminación</h3>
              <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                ¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={cancelDelete}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="flex-1"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
          <div
            className={`p-6 rounded-lg shadow-lg max-w-md w-full ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          >
            <h2 className="text-xl font-semibold mb-4">Modificar Visto Bueno</h2>
            <div>
              <p className="font-medium">Dependencia:</p>
              <Input
                value={selectedItem.de_dependencia}
                readOnly
                className="bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div className="mt-4">
              <p className="font-medium">Empleado:</p>
              <Select
                value={selectedTrabajadorId}
                onValueChange={(value) => setSelectedTrabajadorId(value)}
              >
                <SelectTrigger className="w-full border border-gray-300 rounded px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-800">
                  <SelectValue placeholder="Seleccione un trabajador" />
                </SelectTrigger>
                <SelectContent>
                  {trabajadores.map((empleado) => (
                    <SelectItem key={empleado.cemp_codemp} value={empleado.cemp_codemp}>
                      {empleado.cdes_user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4">
              <p className="font-medium">Indicador:</p>
              <select
                value={updatedIndicador}
                onChange={(e) => setUpdatedIndicador(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-800">
                <option value="1">CON VISTO</option>
                <option value="0">SIN VISTO</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button onClick={handleSaveChanges}>Guardar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}