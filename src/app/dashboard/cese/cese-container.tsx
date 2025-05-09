"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import toasterCustom from "@/components/toaster-custom";
import UsuariosCeseTable from "@/components/table/cese-table";
import { actualizarFechaCese } from "@/actions/usuarios";

interface Usuario {
  id: string;
  nombre: string;
  fecha_fin: string | null;
}

type CeseProps = {
  usuarios: Usuario[];
};

function FechaCeseContainer({ usuarios }: CeseProps) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [usuarioToEdit, setUsuarioToEdit] = useState<Usuario | null>(null);
  const [selectedFecha, setSelectedFecha] = useState<Date | undefined>(undefined);

  const handleEdit = (usuario: Usuario) => {
    setUsuarioToEdit(usuario);
    setSelectedFecha(usuario.fecha_fin ? new Date(usuario.fecha_fin) : new Date());
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioToEdit || !selectedFecha) return;

    toasterCustom(0, "Actualizando...");
    try {
      const res = await actualizarFechaCese(usuarioToEdit.id, selectedFecha);
      if (res.success) {
        toast.dismiss();
        toasterCustom(200, "Fecha de cese actualizada correctamente");
        router.refresh();
        window.location.reload();
      } else {
        toast.dismiss();
        toasterCustom(400, res.message || "Error al actualizar fecha");
      }
    } catch (err) {
      toast.dismiss();
      toasterCustom(400, "Error al actualizar fecha: " + err);
    } finally {
      setIsEditModalOpen(false);
      setUsuarioToEdit(null);
      setSelectedFecha(undefined);
    }
  };

  return (
    <>
      {isEditModalOpen && usuarioToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-card p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Modificar Fecha de Cese</h2>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div>
                <span className="font-semibold">Usuario:</span>
                <p>{usuarioToEdit.nombre}</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-fecha" className="font-semibold">
                  Fecha de Cese:
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !selectedFecha && "text-muted-foreground"
                      )}
                    >
                      {selectedFecha ? format(selectedFecha, "PPP p") : <span>Selecciona una fecha</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedFecha}
                      onSelect={setSelectedFecha}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Actualizar Fecha</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <UsuariosCeseTable usuarios={usuarios} onEdit={handleEdit} />
      </div>
    </>
  );
}

export default FechaCeseContainer;