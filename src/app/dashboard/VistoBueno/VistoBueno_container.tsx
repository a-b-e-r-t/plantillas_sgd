"use client";

import { useState } from "react";
import { obtenerVistoBuenoPorUsuarioYDoc  } from "@/actions/approval";
import VistoBuenoTable from "@/components/table/vistobueno-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function VistoBueno() {
  const [vbData, setVbData] = useState<any[]>([]);
  const [numeroDni, setNumeroDni] = useState<string>("");
  const [numeroDocumento, setNumeroDocumento] = useState<string>("");

  const fetchData = async () => {
    try {
      if (numeroDni && numeroDocumento) {
        const documentoFormateado = numeroDocumento.padStart(6, "0");
        const resultadoVb = await obtenerVistoBuenoPorUsuarioYDoc(numeroDni, documentoFormateado);
        setVbData(resultadoVb);
        
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const handleEdit = (item: any) => {
    console.log("Editando:", item);
  };

  const handleDelete = (item: any) => {
    console.log("Eliminando:", item);
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
        />
      </div>
    </div>
  );
}

export default VistoBueno;
