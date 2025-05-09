/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { actualizarCargo, eliminarCargo, guardarCargo } from "@/actions/cargos";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import CargosTable from "@/components/table/cargo-table";
import { ConfirmDialog } from "@/components/dialog/confirm-dialog";
import { useState } from "react";
import toasterCustom from "@/components/toaster-custom";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Cargo {
  ccar_descar: string;
  ccar_est_car: string;
  ccar_co_cargo: string;
}

type FormData = {
  name: string;
  estado: string;
  cargo: string;
};

type CargoProps = {
  number: number;
  cargos: Cargo[];
};

function CargoContainer({ number, cargos }: CargoProps) {

  const router = useRouter()

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedCargoRemove, setSelectedCargoRemove] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cargoToEdit, setCargoToEdit] = useState<Cargo | null>(null);

  const [selectCargo, setSelectCargo] = useState("");

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenConfirm = (item: Record<string, any>) => {
    console.log(item);

    setSelectedCargoRemove(item.ccar_co_cargo)
    setOpenConfirm(true);
  };

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      estado: "",
      cargo: number
        ? number.toString().length === 3
          ? "0" + number.toString()
          : number.toString()
        : "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { name } = data;
    try {
      const response = await guardarCargo(name, number);
      if (response.success) {
        console.log("Cargo guardado con éxito.");
        window.location.reload();
      } else {
        console.error("Error al guardar el cargo:", response.message);
      }
    } catch (error) {
      console.error("Error al llamar a guardarCargo:", error);
    }
  };

  const handleDelete = async () => {
    setOpenConfirm(false);
    await handleRemove(selectedCargoRemove);
  };

  const handleRemove = async (ccar_co_cargo: string) => {
    toasterCustom(0, "Quitando...")
    try {
      await eliminarCargo(ccar_co_cargo)
      toast.dismiss()
      toasterCustom(200, "Cargo eliminado correctamente.");
      router.refresh()
      window.location.reload();
    }
    catch (err) {
      console.error(err);
    }
  }

  const handleEdit = (cargo: Cargo) => {
    setCargoToEdit(cargo);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(cargoToEdit);
    toasterCustom(0, "Actualizando...")
    try {
      await actualizarCargo(selectCargo, cargoToEdit?.ccar_co_cargo || '')
      toast.dismiss()
      toasterCustom(200, "Cargo actualizado correctamente.");
      router.refresh()
      window.location.reload();
    }
    catch (err) {
      console.error(err);
    }
  }
  console.log(selectCargo);
  

  return (
    <>
      <ConfirmDialog
        isOpen={openConfirm}
        onClose={handleCloseConfirm}
        onConfirm={handleDelete}
        title="¿Estás completamente seguro?"
        description="Esta acción quitará el documento seleccionado."
      />
      {isEditModalOpen && cargoToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-card p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Modificar Plantilla</h2>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div>
                <span className="font-semibold">Documento:</span>
                <p>{cargoToEdit.ccar_co_cargo}</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-file" className="font-semibold">
                  Nombre del Cargo:
                </label>
                <Input placeholder="Administrador" defaultValue={cargoToEdit.ccar_descar}
                  style={{ textTransform: "uppercase" }}
                  onChange={(e) => {
                    (e.target.value.toUpperCase())
                    setSelectCargo(e.target.value)
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit">
                  Actualizar Cargo
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <div className="bg-card border rounded-lg p-4 space-y-4">
          <h1 className="font-semibold text-lg">Agregar un cargo</h1>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-full mx-auto p-4 w-full">
              <div className="flex items-center space-x-4">
                <div className="flex space-x-4 w-full">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Nombre del Cargo:</FormLabel>
                        <FormControl>
                          <Input placeholder="Administrador" {...field}
                            style={{ textTransform: "uppercase" }}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormMessage className="text-end" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cargo"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Código de cargo:</FormLabel>
                        <FormControl>
                          <Input placeholder="0001" {...field} disabled />
                        </FormControl>
                        <FormMessage className="text-end" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center">
                  <Button type="submit" className="h-full">
                    Agregar
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
        <CargosTable cargos={cargos} onEdit={handleEdit} onDelete={handleOpenConfirm} />
      </div>
    </>
  );
}

export default CargoContainer;
