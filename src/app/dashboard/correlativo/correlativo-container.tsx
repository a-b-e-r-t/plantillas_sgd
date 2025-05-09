/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getAnio, getDependencias, getRemitos, getTipoDoc, updateRemitos } from "@/actions/correlativo";
import { getUsers } from "@/actions/users";
import { Combobox } from "@/components/select/comboBox";
import { SelectFilter } from "@/components/select/select-filter";
import RemitoTable from "@/components/table/remitos-table";
import toasterCustom from "@/components/toaster-custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Option {
  value: string;
  label: string;
}

interface Remito {
  nu_emi: string;
  co_emp_emi: string;
  de_doc_sig: string;
  nu_doc_emi: string;
}

function CorrelativoContainer() {

  const router = useRouter();

  const [anio, setAnio] = useState<Option[]>([]);
  const [selectedAnio, setSelectedAnio] = useState("");

  const [dependencias, setDependencia] = useState<Option[]>([]);
  const [selectedDependencia, setSelectDependencia] = useState("");

  const [users, setUsers] = useState<Option[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  const [doc, setDoc] = useState<Option[]>([]);
  const [selectedDoc, setSelectedDoc] = useState("");

  const [remitos, setRemitos] = useState<any[]>([]);
  const [remitosprof, setRemitosProf] = useState<any[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editRemito, setEditRemito] = useState<Remito>();

  const [typeRemito, setTypeRemito] = useState<string>('01');

  const [nu_emi, setnu_emi] = useState<string>('')

  const changeDependenciaSelected = (value: any) => {
    setSelectDependencia(value);
  };

  const changeUserSelected = (value: any) => {
    setSelectedUser(value);
  };

  const changeDocSelected = (value: any) => {
    setSelectedDoc(value);
  };

  const changeAnioSelected = (value: any) => {
    setSelectedAnio(value);
  }

  const getAnioEjec = async () => {
    try {
      const periodos = await getAnio();
      setAnio(periodos);
    } catch (error) {
      console.error("Error al obtener los años:", error);
    }
  }

  const getDependencia = async () => {
    try {
      const dependencias = await getDependencias();
      setDependencia(dependencias);
    } catch (error) {
      console.error("Error al obtener las dependencias:", error);
    }
  };

  const getUser = async () => {
    try {
      const users = await getUsers();
      setUsers(users);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const getDoc = async () => {
    try {
      const tipoDoc = await getTipoDoc();
      setDoc(tipoDoc);
    } catch (error) {
      console.error("Error al obtener los documentos:", error);
    }
  };

  const getRemitidos = async (anio: string, user: string, co_doc: string, ti_emi: string, co_dep_emi: string) => {
    try {
      const remitos = await getRemitos(anio, user, co_doc, ti_emi, co_dep_emi);
      if (ti_emi === '01') {
        setRemitos(remitos);
      } else {
        setRemitosProf(remitos)
      }
    } catch (error) {
      console.error("Error al obtener los documentos:", error);
    }
  };

  const handleEdit = async (value: Remito) => {
    console.log(value);
    setEditRemito(value);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toasterCustom(0, "Actualizando...");

      const response = await updateRemitos(nu_emi, selectedAnio, editRemito?.nu_emi ? editRemito.nu_emi : '');

      if (response.status !== 200) {
        toast.dismiss();
        toasterCustom(response.status, response.message);
        return;
      }

      toast.dismiss();
      toasterCustom(200, response.message);
      setnu_emi('')
      setEditRemito({
        nu_emi: '',
        co_emp_emi: '',
        de_doc_sig: '',
        nu_doc_emi: '',
      });
      setIsEditModalOpen(false);
      router.refresh();
      getRemitidos(selectedAnio, selectedUser, selectedDoc, typeRemito, selectedDependencia);

    } catch (error) {
      toast.dismiss();
      toasterCustom(500, "" + error || "Error al actualizar.");
    }
  };

  useEffect(() => {
    getAnioEjec();
    getDependencia();
    getUser();
    getDoc();
  }, []);

  return (
    <>
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-card p-6 rounded-lg w-11/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Actualizar correlativo</h2>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div>
                <span className="font-semibold">Número de correlativo:</span>
                <Input defaultValue={editRemito?.nu_doc_emi} maxLength={6} type="number" onChange={(e) => {
                  setnu_emi(e.target.value);
                }}/>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Actualizar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-card space-y-2">
          <h1 className="text-lg font-semibold">Datos del correlativo</h1>
          <form action="" className="space-y-3">
            <div className="space-y-2">
              <label className="text-base font-medium">Año:</label>
              <SelectFilter options={anio} placeholder="Seleccione año" onChange={changeAnioSelected} value={selectedAnio}/>
            </div>
            <div className="space-y-2">
              <label className="text-base font-medium">Dependencia:</label>
              <Combobox
                options={dependencias}
                placeholder="Seleccione dependencia"
                onChange={changeDependenciaSelected}
                value={selectedDependencia}
              />
            </div>
            <div className="space-y-2">
              <label className="text-base font-medium">Usuario:</label>
              <Combobox options={users} placeholder="Seleccione usuario" onChange={changeUserSelected} value={selectedUser} />
            </div>
            <div className="space-y-2">
              <label className="text-base font-medium">Tipo de documento:</label>
              <Combobox options={doc} placeholder="Seleccione tipo de documento" onChange={changeDocSelected} value={selectedDoc} />
            </div>
            <div className="flex items-center justify-center">
              <Button
                type="button"
                disabled={ selectedAnio === "" || selectedDependencia === "" || selectedUser === "" || selectedDoc === ""}
                onClick={() => {
                  getRemitidos(selectedAnio, selectedUser, selectedDoc, "01", selectedDependencia)
                  getRemitidos(selectedAnio, selectedUser, selectedDoc, "05", selectedDependencia)
                  if (remitos.length > 0) {
                    setTypeRemito("01");
                  } else {
                    setTypeRemito("05");
                  }
                }}>
                Buscar
              </Button>
            </div>
          </form>
        </div>
        <div className="border bg-card p-2 space-y-2 rounded-lg">
          <div className="space-x-2">
            <Button
              onClick={() => {
                getRemitidos(selectedAnio, selectedUser, selectedDoc, "01", selectedDependencia)
                setTypeRemito("01");
              }}
              disabled={remitos.length === 0}
              variant={typeRemito === "01" ? "outline" : "secondary"}
              className={typeRemito === "01" ? "border-primary text-primary hover:text-primary" : "hover:bg-primary/10 hover:text-primary"}
              >
              Administrativos
            </Button>
            <Button
              onClick={() => {
                getRemitidos(selectedAnio, selectedUser, selectedDoc, "05", selectedDependencia)
                setTypeRemito("05");
              }}
              disabled={remitosprof.length === 0}
              variant={typeRemito === "01" ? "secondary" : "outline"}
              className={typeRemito === "01" ? "hover:bg-primary/10 hover:text-primary" : "border-primary text-primary hover:text-primary"}>
              Del profesional
            </Button>
          </div>
          <RemitoTable remitos={typeRemito === '01' ? remitos : remitosprof} onEdit={handleEdit} />
        </div>
      </div>
    </>
  );
}

export default CorrelativoContainer;
