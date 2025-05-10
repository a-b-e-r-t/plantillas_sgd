import React, { useState, useEffect } from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";

interface VistoBueno {
  de_dependencia: string;
  cdes_user: string;
  co_emp_vb: string;
  in_vb: string;
  fe_vb: string | null;
  co_dependencia: string;
}

interface Props {
  data: VistoBueno[];
  onEdit: (item: VistoBueno) => void;
  onDelete: (item: VistoBueno) => void;
}

export default function VistoBuenoTable({ data, onEdit, onDelete }: Props) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<VistoBueno[]>(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VistoBueno | null>(null);
  const [updatedDependencia, setUpdatedDependencia] = useState("");
  const [updatedEmpleado, setUpdatedEmpleado] = useState("");
  const [updatedIndicador, setUpdatedIndicador] = useState("");

  useEffect(() => {
    const filtered = data.filter((item) =>
      (item.de_dependencia && item.de_dependencia.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.cdes_user && item.cdes_user.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.in_vb && item.in_vb.toLowerCase().includes(searchTerm.toLowerCase()))
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
    setUpdatedDependencia(item.de_dependencia);
    setUpdatedEmpleado(item.cdes_user);
    setUpdatedIndicador(item.in_vb);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSaveChanges = () => {
    if (
      selectedItem &&
      (updatedDependencia !== selectedItem.de_dependencia ||
        updatedEmpleado !== selectedItem.cdes_user ||
        updatedIndicador !== selectedItem.in_vb)
    ) {
      const updatedItem: VistoBueno = {
        ...selectedItem,
        de_dependencia: updatedDependencia,
        cdes_user: updatedEmpleado,
        in_vb: updatedIndicador,
      };
      onEdit(updatedItem);
      closeModal();
    }
  };

  return (
    <div className="space-y-4 bg-card p-4 rounded-lg border border-border">
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
              <TableRow key={idx}>
                <TableCell>{item.de_dependencia}</TableCell>
                <TableCell>{item.cdes_user}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-white ${
                      item.in_vb === "1" ? "bg-green-500" : "bg-red-500"
                    }`}
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
                      className="rounded-full text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                      title="Editar"
                      onClick={() => openModal(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                      title="Eliminar"
                      onClick={() => onDelete(item)}
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

      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
          <div
            className={`p-6 rounded-lg shadow-lg max-w-md w-full ${
              theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">Modificar Visto Bueno</h2>
            <div>
              <p className="font-medium">Dependencia:</p>
              <Input
                value={updatedDependencia}
                readOnly
                className="bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div className="mt-4">
              <p className="font-medium">Empleado:</p>
              <Input
                value={updatedEmpleado}
                onChange={(e) => setUpdatedEmpleado(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <p className="font-medium">Código de la dependencia:</p>
              <Input
                value={selectedItem.co_dependencia}
                readOnly
                className="bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div className="mt-4">
              <p className="font-medium">Indicador:</p>
              <Select
                value={updatedIndicador}
                onValueChange={setUpdatedIndicador}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar indicador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">CON VISTO</SelectItem>
                  <SelectItem value="0">SIN VISTO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={closeModal}>
                Cerrar
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={
                  updatedDependencia === selectedItem.de_dependencia &&
                  updatedEmpleado === selectedItem.cdes_user &&
                  updatedIndicador === selectedItem.in_vb
                }
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
