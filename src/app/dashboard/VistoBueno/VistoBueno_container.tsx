/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { buscarRemitosPorUsuarioYDoc, obtenerVistoBueno } from "@/actions/approval";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function VistoBueno() {
  const [remitos, setRemitos] = useState<any[]>([]);
  const [vbData, setVbData] = useState<any[]>([]);
  const [numeroDni, setNumeroDni] = useState<string>("");
  const [numeroDocumento, setNumeroDocumento] = useState<string>("");

  // Simular búsqueda de remitos por número de DNI y número de documento
  const fetchData = async () => {
    try {
      if (numeroDni && numeroDocumento) {
        const resultadoRemitos = await buscarRemitosPorUsuarioYDoc(numeroDni, numeroDocumento);
        setRemitos(resultadoRemitos);

        const resultadoVb = await obtenerVistoBueno(numeroDni, numeroDocumento);
        setVbData(resultadoVb);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
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
        <h2 className="text-lg font-semibold">Remitos encontrados</h2>
        <ul className="list-disc ml-6">
          {remitos.map((item, idx) => (
            <li key={idx}>N° Emisión: {item.nu_emi}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Datos de visto bueno</h2>
        <ul className="list-disc ml-6">
          {vbData.map((item, idx) => (
            <li key={idx}>
              {item.co_dep} - {item.obs_vb || "Sin observaciones"} ({item.fe_vb || "Sin fecha"})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default VistoBueno;
