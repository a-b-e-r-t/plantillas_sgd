/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getDocumentsVerif, getDocumentsVerificaAll, removeVerifDocument, saveVerifDocument } from "@/actions/documento";
import { ConfirmDialog } from "@/components/dialog/confirm-dialog";
import { Combobox } from "@/components/select/comboBox";
import DocumentsTable from "@/components/table/documentos-table";
import toasterCustom from "@/components/toaster-custom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Option {
  value: string;
  label: string;
}

function VerificaContainer() {
  const [docs, setDocs] = useState<any[]>([]);
  const [allDocs, setAllDocs] = useState<Option[]>([]);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [selectedDocRemove, setSelectedDocRemove] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenConfirm = (item: Record<string, any>) => {
    setSelectedDocRemove(item.cdoc_tipdoc);
    setOpenConfirm(true);
  };

  const changeDocSelected = (value: any) => {
    setSelectedDoc(value);
  };

  const getDoc = async () => {
    const response = await getDocumentsVerif();
    setDocs(response);
  };

  const getAllDocs = async () => {
    const response = await getDocumentsVerificaAll();
    setAllDocs(response);
  };

  const handleSave = async (cdoc_tipdoc: string) => {
    if (selectedDoc === "") {
      toasterCustom(500, "Debe seleccionar un documento.");
      return;
    }
    toasterCustom(0, "Guardando ...")
    try {
      await saveVerifDocument(cdoc_tipdoc);
      toast.dismiss()
      toasterCustom(200, "Documento agreagado correctamente.");
      getDoc();
      getAllDocs();
      setSelectedDoc("");
      // Reset form here if needed
    }
    catch (err) {
      console.error(err);
    }
  }

  console.log(selectedDoc);

  const handleRemove = async (cdoc_tipdoc: string) => {
    toasterCustom(0, "Quitando...")
    try {
      await removeVerifDocument(cdoc_tipdoc);
      toast.dismiss()
      toasterCustom(200, "Documento quitado correctamente.");
      getDoc();
      getAllDocs();
      setSelectedDoc("");
    }
    catch (err) {
      console.error(err);
    }
  }

  const handleDelete = async () => {
    setOpenConfirm(false);
    await handleRemove(selectedDocRemove);
  };

  useEffect(() => {
    getDoc();
    getAllDocs();
  }, []);

  return (
    <>
    <ConfirmDialog
        isOpen={openConfirm}
        onClose={handleCloseConfirm}
        onConfirm={handleDelete}
        title="¿Estás completamente seguro?"
        description="Esta acción quitará el documento seleccionado."
      />
    <div className="space-y-4">
      <div className="bg-card border rounded-lg p-4 space-y-4">
        <h1 className="font-semibold text-lg">Agregar documento para verificación</h1>
        <div className="flex flex-col sm:flex-row space-y-4 justify-between">
          <div className="space-y-2">
            <span className="font-bold">Seleccione:</span>
            <Combobox options={allDocs} placeholder="Seleccione" onChange={changeDocSelected} value={selectedDoc}/>
          </div>
          <div className="flex items-end">
            <Button disabled={selectedDoc === ""} onClick={() => handleSave(selectedDoc)}>
              Agregar
            </Button>
          </div>
        </div>
      </div>
      <DocumentsTable documents={docs} onDelete={handleOpenConfirm} />
    </div>
    </>
  );
}

export default VerificaContainer;
