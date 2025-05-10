"use server";

import { query } from "@/lib/db";

export interface VistoBueno {
  nu_ann: string;
  nu_emi: string;
  co_dep: string;
  co_emp_vb: string;
  in_vb: string;
  fe_vb: string;
  co_use_cre: string;
  fe_use_cre: string;
  co_use_mod: string;
  fe_use_mod: string;
  obs_vb: string;
}

export interface Empleado {
  cemp_codemp: string;
}

export async function obtenerVistoBuenoPorUsuarioYDoc(
  co_use_cre: string,
  docParcial: string
): Promise<VistoBueno[]> {
  try {
    const docFormateado = docParcial.padStart(6, "0");

    const result = await query<VistoBueno>(
      `SELECT 
            rd.co_dependencia,
            rd.de_dependencia,
            vb.co_emp_vb, 
            su.cdes_user,
            vb.in_vb,
            vb.fe_vb  -- Traemos solo el nombre de la dependencia
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
