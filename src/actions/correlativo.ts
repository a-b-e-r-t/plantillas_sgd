

"use server";

import { query } from '@/lib/db';

interface Option {
  value: string;
  label: string;
}

export async function getAnio() {
  try {
    const result = await query<Option>(
      "SELECT cano_anoeje as value, cano_anoeje as label FROM idosgd.si_mae_ano_ejecucion ORDER BY cano_anoeje DESC;", 
      []
    );
    return result;
  } catch (error) {
    console.error('Error al obtener las dependencias:', error);
    return [];
  }
}

export async function getDependencias(){
  try {
    const result = await query<Option>(
      "SELECT co_dependencia as value, titulo_dep as label FROM idosgd.rhtm_dependencia ORDER BY titulo_dep ASC;", 
      []
    );
    return result;
  } catch (error) {
    console.error('Error al obtener las dependencias:', error);
    return [];
  }
}

export async function getTipoDoc() {
  try {
    const result = await query<Option>(
      "SELECT cdoc_tipdoc as value, cdoc_desdoc as label FROM idosgd.si_mae_tipo_doc ORDER BY cdoc_desdoc ASC;", 
      []
    );
    return result;
  } catch (error) {
    console.error('Error al obtener tipos de documentos:', error);
    return [];
  }
}

export async function getRemitos(anio:string, user: string, co_doc: string, ti_emi: string, co_dep_emi: string){
  try {
    const result = await query(
      `SELECT nu_emi, co_emp_emi, nu_doc_emi, de_doc_sig
      FROM idosgd.tdtv_remitos
      WHERE nu_ann=$1 AND co_use_cre=$2 and co_tip_doc_adm=$3 and ti_emi=$4 and co_dep_emi=$5 AND nu_doc_emi IS NOT NULL ORDER BY nu_doc_emi DESC;`, 
      [anio, user, co_doc, ti_emi, co_dep_emi]
    );
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error al obtener los remitos:', error);
    return [];
  }
}

export async function updateRemitos(nu_doc_emi: string, anio: string, nu_emi: string) {
  try {

    if (nu_doc_emi.length !== 6) {
      return {
        status: 400,
        message: 'El número de emisión debe tener 6 caracteres.',
      }
    }

    if (!/^[0-9]+$/.test(nu_doc_emi)) {
      return {
        status: 400,
        message: 'El número de emisión sólo puede contener números.',
      }
    }

    await query(
      "UPDATE idosgd.tdtv_remitos SET nu_doc_emi=$1 WHERE nu_ann=$2 AND nu_emi=$3 RETURNING *;",
      [nu_doc_emi, anio, nu_emi]
    );

    return {
      status: 200,
      message: 'Actualizado correctamente.',
    }

  } catch (error) {
    return {
      status: 500,
      message: 'Error: ' + error,
    }
  }
}

// UPDATE idosgd.tdtv_remitos
// SET nu_doc_emi='000001'
// WHERE nu_ann='2024' AND nu_emi='0000000603';