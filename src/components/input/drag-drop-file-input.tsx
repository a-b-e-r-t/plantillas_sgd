import { Input } from "@/components/ui/input";
import { useRef } from "react";
import toasterCustom from "../toaster-custom";

interface DragDropFileInputProps {
  file: File | null;
  setFile: (file: File | null) => void;
  accept?: string;
  placeholderText?: string;
  onFileSelect?: (file: File) => void;
}

export default function DragDropFileInput({
  file,
  setFile,
  accept = ".docx",
  placeholderText = "Arrastra y suelta un archivo aquí o haz clic para seleccionar",
  onFileSelect,
}: DragDropFileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleDragEnter = () => {
    wrapperRef.current?.classList.add("border-primary", "bg-primary/10");
  };
  
  const handleDragLeave = () => {
    wrapperRef.current?.classList.remove("border-primary", "bg-primary/10");
  };
  
  const handleDrop = () => {
    wrapperRef.current?.classList.remove("border-primary", "bg-primary/10");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      setFile(selectedFile);
      onFileSelect?.(selectedFile);
    } else {
      toasterCustom(400, "Solo se permiten archivos .docx.");
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full border-dashed border-2 rounded-lg flex items-center justify-center p-4 ${
        file ? "border-primary" : "border-border hover:border-primary hover:bg-primary/10"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center flex flex-col items-center justify-center p-2">
        {file ? (
          <p className="text-sm font-medium text-muted-foreground">{file.name}</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-2">{placeholderText}</p>
            <p className="text-xs text-muted-foreground">Solo se permiten archivos .docx</p>
          </>
        )}
      </div>
      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
}
