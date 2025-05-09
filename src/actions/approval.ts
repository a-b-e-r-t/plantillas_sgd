"use server";

import { query } from "@/lib/db";

export interface Remito {
  nu_emi: string;
}

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


export async function buscarRemitosPorUsuarioYDoc(co_use_cre: string, docParcial: string): Promise<Remito[]> {
  try {
    const result = await query<Remito>(
      `SELECT nu_emi
      FROM idosgd.tdtv_remitos
      WHERE co_use_cre = $1 AND nu_doc_emi LIKE $2`,
      [co_use_cre, `%${docParcial}%`]
    );
    return result;
  } catch (error) {
    console.error("Error al buscar remitos:", error);
    return [];
  }
}

export async function obtenerVistoBueno(nu_ann: string, nu_emi: string): Promise<VistoBueno[]> {
  try {
    const result = await query<VistoBueno>(
      `SELECT 
        nu_ann, nu_emi, co_dep, co_emp_vb, in_vb, fe_vb, co_use_cre,
        fe_use_cre, co_use_mod, fe_use_mod, obs_vb
      FROM idosgd.tdtv_personal_vb
      WHERE nu_ann = $1 AND nu_emi = $2`,
      [nu_ann, nu_emi]
    );
    return result;
  } catch (error) {
    console.error("Error al obtener visto bueno:", error);
    return [];
  }
}
