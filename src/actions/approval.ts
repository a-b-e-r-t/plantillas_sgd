"use server";

import { query } from "@/lib/db";

export interface VistoBueno {
  nu_ann: string;
  nu_emi: string;
  co_dep: string;
  co_emp_vb: string;
  in_vb: string;
  fe_vb: string | null;
  co_use_cre: string;
  fe_use_cre: string;
  co_use_mod: string;
  fe_use_mod: string;
  obs_vb: string;
  de_dependencia: string;
  cdes_user: string;
  co_dependencia: string;

}

export interface Empleado {
  cemp_codemp: string;
  cdes_user: string;
}

export interface ActualizacionResult {
  success: boolean;
  message: string;
}

export async function obtenerVistoBuenoPorUsuarioYDoc(
  co_use_cre: string,
  docParcial: string
): Promise<VistoBueno[]> {
  try {
    const docFormateado = docParcial.padStart(6, "0");

    const result = await query<VistoBueno>(
      `SELECT 
            vb.nu_emi,
            rd.co_dependencia,
            rd.de_dependencia,
            vb.co_emp_vb, 
            su.cdes_user,
            vb.in_vb,
            vb.fe_vb 
        FROM 
            idosgd.tdtv_personal_vb vb
        JOIN
            idosgd.seg_usuarios1 su ON su.cemp_codemp = vb.co_emp_vb -- Relación entre el código del empleado y la tabla de usuarios
        JOIN
            idosgd.rhtm_dependencia rd ON rd.co_dependencia = vb.co_dep -- Relacionamos la tabla de dependencias usando co_dep
        WHERE 
            vb.nu_ann = '2025'
            AND vb.nu_emi IN (
                SELECT r.nu_emi
                FROM idosgd.tdtv_remitos r
                WHERE r.co_use_cre = $1 
                  AND r.nu_doc_emi LIKE $2
    )`,
      [co_use_cre, `%${docFormateado}%`]
    );

    return result;
  } catch (error) {
    console.error("Error al obtener visto bueno:", error);
    return [];
  }
}

export async function TrabajadorAllDepen(
  co_dependencia: string
): Promise<Empleado[]> {
  try {
    const result = await query<Empleado>(
      `SELECT 
          e.cemp_codemp, 
          u.cdes_user
        FROM 
            "IDOSGD_GRA".idosgd.rhtm_per_empleados e
        JOIN 
            "IDOSGD_GRA".idosgd.seg_usuarios1 u 
            ON u.cemp_codemp = e.cemp_codemp 
        WHERE 
            e.cemp_co_depend = $1 ORDER by u.cdes_user ASC
`,
      [co_dependencia]
    );
    return result;
  } catch (error) {
    console.error("Error al obtener empleados por dependencia:", error);
    return [];
  }
}

export async function eliminarVistoBueno(
  nu_emi: string,
): Promise<boolean> {
  try {
    await query(
      `DELETE FROM idosgd.tdtv_personal_vb
        WHERE nu_emi = $1`,
      [nu_emi]
    );
    return true;
  } catch (error) {
    console.error("Error al eliminar visto bueno:", error);
    return false;
  }
}

export async function actualizarInVbConRestriccion(
  nu_emi: string,
  nuevoValor: string,
  co_emp_vb: string,
): Promise<ActualizacionResult> {
  console.log("Valores recibidos:", { nu_emi, nuevoValor, co_emp_vb });
  try {
    if (nuevoValor !== "0" && nuevoValor !== "1") {
      return {
        success: false,
        message: "El valor debe ser '0' o '1'",
      };
    }

    const [registro] = await query<{ in_vb: string }>(
      `SELECT in_vb FROM idosgd.tdtv_personal_vb WHERE nu_emi = $1 AND co_emp_vb = $2`,
      [nu_emi, co_emp_vb]
    );

    if (!registro) {
      return {
        success: false,
        message: "No existe el registro especificado",
      };
    }

    const valorActual = registro.in_vb;

    if (valorActual === "0" && nuevoValor === "1") {
      return {
        success: false,
        message: "No se puede cambiar de 'Sin Visto' a 'Con Visto'",
      };
    }

    await query(
      `UPDATE idosgd.tdtv_personal_vb SET in_vb = $1 WHERE nu_emi = $2 AND co_emp_vb = $3`,
      [nuevoValor, nu_emi, co_emp_vb]
    );

    return {
      success: true,
      message:
        nuevoValor === "0"
          ? "Cambiado a 'Sin Visto' correctamente"
          : "Visto bueno actualizado correctamente",
    };
  } catch (error) {
    console.error("Error al actualizar in_vb:", error);
    return {
      success: false,
      message: "Error interno del servidor",
    };
  }
}

