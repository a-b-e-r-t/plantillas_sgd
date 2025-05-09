/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getDocumentsCod, insertNewPlantillaDocumento } from "@/actions/documento";
import { getTemplatesAll, updateTemplatesDesc } from "@/actions/templates"; 
import DocumentTable from "@/components/table/doc-plantillas-table";
import { ConfirmDialog } from "@/components/dialog/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function DocumentoContainer() {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    const fetchMaxCode = async () => {
      try {
        const result = await getDocumentsCod();
        const nextCode = (result?.[0]?.max_tipdoc ?? 0) + 1;
        setInput1(String(nextCode));
      } catch (error) {
        console.error("Error al obtener el código máximo:", error);
      }
    };

    fetchMaxCode();
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templatesData = await getTemplatesAll();
        setTemplates(templatesData);
      } catch (error) {
        console.error("Error al obtener los templates:", error);
      }
    };

    fetchTemplates();
  }, []);

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenConfirm = () => {
    if (input1.trim() === "" || input2.trim() === "") {
      return;
    }
    setOpenConfirm(true);
  };

  const handleAccion = async () => {
    setOpenConfirm(false);
    try {
      await insertNewPlantillaDocumento(input2);

      setInput2("");

      const result = await getDocumentsCod();
      const nextCode = (result?.[0]?.max_tipdoc ?? 0) + 1;
      setInput1(String(nextCode)); 
    } catch (err) {
      console.error("Error al guardar el documento:", err);
    }
  };

  const handleEdit = async (document: any) => {
    const updatedLabel = document.label; 
    const updatedEstado = document.cdoc_indbaj; 

    if (updatedLabel !== null && updatedEstado !== null) {
      try {
        await updateTemplatesDesc(updatedEstado, updatedLabel, document.value);

        const updatedTemplates = templates.map((template) =>
          template.value === document.value
            ? { ...template, label: updatedLabel, cdoc_indbaj: updatedEstado }
            : template
        );
        setTemplates(updatedTemplates);
      } catch (error) {
        console.error("Error al actualizar la plantilla:", error);
      }
    }
  };

  return (
    <>
      <ConfirmDialog
        isOpen={openConfirm}
        onClose={handleCloseConfirm}
        onConfirm={handleAccion}
        title="¿Confirmar acción?"
        description="¿Deseas enviar estos datos? Esta operación no se puede deshacer."
      />
      <div className="space-y-4">
        <div className="bg-card border rounded-lg p-4 space-y-4">
          <h1 className="font-semibold text-lg">Enviar datos de plantilla</h1>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
            <div className="flex flex-col w-full">
              <span className="font-bold">Código:</span>
              <Input
                placeholder="Código generado"
                value={input1}
                readOnly
                onChange={(e) => setInput1(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full">
              <span className="font-bold">Descripción:</span>
              <Input
                placeholder="Ingrese la descripción"
                value={input2}
                onChange={(e) => setInput2(e.target.value.toUpperCase())}
              />
            </div>
            <div className="pt-1">
              <Button onClick={handleOpenConfirm}>Guardar</Button>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="space-y-4">
        <div className="bg-card border rounded-lg p-4 space-y-4">
          <h1 className="font-semibold text-lg">Plantillas Disponibles</h1>
          <DocumentTable documents={templates} onEdit={handleEdit} />
        </div>
      </div>
    </>
  );
}

export default DocumentoContainer;
