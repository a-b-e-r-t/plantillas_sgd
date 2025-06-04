"use client";

import { useState } from "react";
import {
  obtenerVistoBuenoPorUsuarioYDoc,
  eliminarVistoBueno,
  actualizarInVbConRestriccion,
  ActualizacionResult,
  TrabajadorAllDepen,
} from "@/actions/approval";
import type { VistoBueno,Empleado } from "@/actions/approval";
import VistoBuenoTable from "@/components/table/vistobueno-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toasterCustom from "@/components/toaster-custom";
import { toast } from "sonner";

function VistoBueno() {
  const [vbData, setVbData] = useState<VistoBueno[]>([]);
  const [numeroDni, setNumeroDni] = useState<string>("");
  const [numeroDocumento, setNumeroDocumento] = useState<string>("");
  const [trabajadoresDependencia, setTrabajadoresDependencia] = useState<Empleado[]>([]);
  const fetchData = async () => {
    try {
      if (numeroDni && numeroDocumento) {
        const documentoFormateado = numeroDocumento.padStart(6, "0");
        toasterCustom(0, "Buscando visto bueno...");
        const resultadoVb: VistoBueno[] = await obtenerVistoBuenoPorUsuarioYDoc(
          numeroDni,
          documentoFormateado
        );
        setVbData(resultadoVb);
        toast.dismiss();
        toasterCustom(200, "Datos cargados correctamente");
      } else {
        toasterCustom(400, "Debe ingresar el DNI y el número de documento");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error al obtener los datos:", error);
      toasterCustom(500, "Error al obtener los datos");
    }
  };

  const handleEdit = async (item: VistoBueno) => {
    console.log("Datos recibidos del modal para enviar al backendddddd:", item);
    if (item.in_vb === "0") {
      const nuevoValor = "0";
      const co_emp_vb = item.co_emp_vb;
      try {
        toasterCustom(0, "Actualizando visto bueno...");
        const resultado: ActualizacionResult = await actualizarInVbConRestriccion(
          item.nu_emi,
          nuevoValor,
          co_emp_vb,
        );
        toast.dismiss();

        if (resultado.success) {
          setVbData((prev) =>
            prev.map((vb) =>
              vb.nu_emi === item.nu_emi && vb.co_emp_vb === co_emp_vb
                ? { ...vb, in_vb: nuevoValor }
                : vb
            )
          );
          toasterCustom(200, resultado.message);
          if (item.co_dependencia) {
            await handleGet(item.co_dependencia);
          }
        } else {
          toasterCustom(400, resultado.message);
        }
      } catch {
        toast.dismiss();
        toasterCustom(500, "Error al actualizar el registro");
      }
    } else {
      toasterCustom(400, "No se puede cambiar de 'Sin Visto' a 'Con Visto'");
      return;
    }
  };

  const handleDelete = async (item: VistoBueno) => {
    try {
      toasterCustom(0, "Eliminando visto bueno...");
      const eliminado = await eliminarVistoBueno(item.nu_emi);
      if (eliminado) {
        setVbData((prev) => prev.filter((vb) => vb.nu_emi !== item.nu_emi));
        toast.dismiss();
        toasterCustom(200, "Registro eliminado exitosamente");
      } else {
        toast.dismiss();
        toasterCustom(400, "No se pudo eliminar el registro");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error al eliminar:", error);
      toasterCustom(500, "Error al eliminar el registro");
    }
  };

  const handleGet = async (co_dependencia: string) => {
    try {
      const trabajadores = await TrabajadorAllDepen(co_dependencia);
      setTrabajadoresDependencia(trabajadores);
    } catch (error) {
      console.error("Error al obtener trabajadores:", error);
      toasterCustom(500, "Error al cargar trabajadores");
    }
  };


  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Visto Bueno</h1>

      <div className="flex flex-col sm:flex-row sm:gap-6">
        <div className="flex flex-col w-full">
          <span className="font-bold">Número de DNI:</span>
          <Input
            placeholder="Ingrese el número de DNI"
            value={numeroDni}
            onChange={(e) => setNumeroDni(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full">
          <span className="font-bold">Número de documento:</span>
          <Input
            placeholder="Ingrese el número de documento"
            value={numeroDocumento}
            onChange={(e) => setNumeroDocumento(e.target.value)}
          />
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={fetchData}>Buscar</Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Datos de visto bueno</h2>
        <VistoBuenoTable
          data={vbData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onGetTrabajadores={handleGet}
          trabajadores={trabajadoresDependencia}
        />
      </div>
    </div>
  );
}

export default VistoBueno;
