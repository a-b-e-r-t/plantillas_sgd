"use client";

import { downloadTemplateById, getTemplatesNull, uploadTemplate } from "@/actions/templates";
import DocumentTable from "@/components/table/plantilla-table";
import toasterCustom from "@/components/toaster-custom";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Combobox } from "@/components/select/comboBox";
import { Button } from "@/components/ui/button";
import DragDropFileInput from "@/components/input/drag-drop-file-input";

interface Document {
  co_tipo_doc: string;
  nom_archivo: string;
}

interface Option {
  value: string
  label: string;
}

interface DocumentTableProps {
  documents: Document[];
}

function PlantillaContainer({ documents }: DocumentTableProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>("");
  const [file, setFile] = useState<File | null>(null);
  const [templates, setTemplates] = useState<Option[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<Document | null>(null);
  const [editedFile, setEditedFile] = useState<File | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const result = await getTemplatesNull();
        setTemplates(result || []);
      } catch (error) {
        console.error("Error al cargar las plantillas:", error);
        toasterCustom(500, "Error al cargar las plantillas vacias.");
      }
    };

    fetchTemplates();
  }, []);

  const handleEdit = (doc: Document) => {
    setDocumentToEdit(doc);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentToEdit || !editedFile) {
      toasterCustom(400, "Selecciona un archivo para actualizar.");
      return;
    }

    try {
      toasterCustom(0, "Actualizando plantilla...");

      const response = await uploadTemplate(documentToEdit.co_tipo_doc, editedFile);

      if (response.status !== 200) {
        toast.dismiss();
        toasterCustom(response.status, response.message);
        return;
      }

      toast.dismiss();
      toasterCustom(200, response.message);
      setDocumentToEdit(null);
      setEditedFile(null);
      setIsEditModalOpen(false);
      router.refresh();

      // Resetear el input de archivo de edición
      if (editFileInputRef.current) {
        editFileInputRef.current.value = "";
      }
    } catch (error) {
      toast.dismiss();
      toasterCustom(500, "" + error || "Error al actualizar la plantilla.");
    }
  };

  const handleDownload = async (doc: Document) => {
    console.log(doc);
    toasterCustom(0, "Descargando plantilla");
    const response = await downloadTemplateById(doc.co_tipo_doc);

    if (response.status !== 200) {
      toast.dismiss();
      toasterCustom(response.status, response.message);
    }

    const { fileName, fileContent } = response;

    // Decodificar contenido Base64 a Uint8Array
    const binaryString = atob(fileContent); // `atob` decodifica Base64
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: "aplication/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    toast.dismiss();
    toasterCustom(200, "Descarga exitosa");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTemplate || !file) {
      toasterCustom(400, "Selecciona una plantilla y sube un archivo.");
      return;
    }

    try {
      toasterCustom(0, "Subiendo plantilla...");

      const response = await uploadTemplate(selectedTemplate, file);

      if (response.status !== 200) {
        toast.dismiss();
        toasterCustom(response.status, response.message);
        return;
      }

      toast.dismiss();
      toasterCustom(200, response.message);
      setSelectedTemplate(null);
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      router.refresh();
    } catch (error) {
      toast.dismiss();
      toasterCustom(500, "" + error || "Error al subir la plantilla.");
    }
  };

  return (
    <>
      {isEditModalOpen && documentToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-card p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Modificar Plantilla</h2>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div>
                <span className="font-semibold">Documento:</span>
                <p>{documentToEdit.nom_archivo}</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-file" className="font-semibold">
                  Subir Nuevo Archivo (.docx):
                </label>
                <DragDropFileInput file={editedFile} setFile={setEditedFile} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!editedFile || editedFile.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}>
                  Actualizar Plantilla
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="container mx-auto space-y-5">
        <div className="bg-card p-4 rounded-lg space-y-4 border">
          <h1 className="text-lg font-semibold">Agregar nueva plantilla</h1>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-sm:items-center">
            <div className="space-y-2 font-semibold w-full">
              <span>Seleccione:</span>
              <Combobox placeholder="Seleccionar plantilla" options={templates} onChange={setSelectedTemplate} value={selectedTemplate || ""} />
            </div>
            <div className="space-y-2 font-semibold w-full flex flex-col">
              <span>Subir Archivo (.docx):</span>
              <DragDropFileInput file={file} setFile={setFile} />
            </div>
            <div className="space-y-2 font-semibold w-full flex flex-col">
              <span>{"_"}</span>
              <Button
                type="submit"
                disabled={
                  selectedTemplate === "" ||
                  file === null ||
                  file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                }>
                Subir Plantilla
              </Button>
            </div>
          </form>
        </div>
        <DocumentTable documents={documents} onEdit={handleEdit} onDownload={handleDownload} />
      </div>
    </>
  );
}

export default PlantillaContainer;
