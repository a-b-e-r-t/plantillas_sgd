"use server";

import { query } from "@/lib/db";

interface Option {
  value: string;
  label: string;
}

export async function getDocumentsCod() {
  try {
    const result = await query(
      `SELECT MAX(CAST(cdoc_tipdoc AS INTEGER)) AS max_tipdoc
        FROM idosgd.si_mae_tipo_doc;`,
      []
    );
    return result;
  } catch (error) {
    console.error("Error al obtener los documentos del profesional: ", error);
    return [];
  }
}

export async function getDocumentsCodDoc() {
    try {
      const result = await query(
        `SELECT MAX(CAST(co_tipo_doc AS INTEGER)) AS max_tipo_doc
          FROM idosgd.tdtr_plantilla_docx;`, 
        []
      );
      return result;
    } catch (error) {
      console.error("Error al obtener el máximo co_tipo_doc: ", error);
      return [];
    }
}

export async function getDocumentsProf() {
  try {
    const result = await query(
      `SELECT cdoc_tipdoc, cdoc_desdoc
      FROM idosgd.si_mae_tipo_doc
      WHERE cdoc_grupo='02'
      ORDER BY cdoc_desdoc ASC;`,
      []
    );
    return result;
  } catch (error) {
    console.error("Error al obtener los documentos del profesional: ", error);
    return [];
  }
}

export async function getDocumentsAll() {
  try {
    const result = await query<Option>(
      `SELECT cdoc_tipdoc as value, cdoc_desdoc as label
      FROM idosgd.si_mae_tipo_doc
      WHERE cdoc_grupo NOT IN ('02')
      ORDER BY cdoc_desdoc ASC;`,
      []
    );
    return result;
  } catch (error) {
    console.error("Error al obtener todos los documentos: ", error);
    return [];
  }
}

export async function saveDocument(cdoc_tipdoc: string) {
  try {
    // Traer los codigos de todas las dependencias

    const cdoc = await query(
      `SELECT co_dependencia
      FROM idosgd.rhtm_dependencia;`,
      []
    );
    // Verficar si el documento ya está asignado a todas las dependencias
    cdoc.map(async (cod) => {
      const docAsign = await query(
        `
        SELECT co_dep, co_tip_doc
        FROM idosgd.sitm_doc_dependencia
        WHERE co_dep=$1 AND co_tip_doc=$2;
        `,
        [cod.co_dependencia, cdoc_tipdoc]
      );

      if (docAsign.length === 0) {
        console.log({ cod, docAsign });

        // Asignar el documento a todas las dependencias

        await query(`
          INSERT INTO idosgd.sitm_doc_dependencia
          (co_dep, co_tip_doc, es_eli, co_use_cre, fe_use_cre, co_use_mod, fe_use_mod, es_obl_firma)
          VALUES($1, $2, '1', 'ADMIN', CURRENT_DATE, 'ADMIN', CURRENT_DATE, '1');
        `,
        [cod.co_dependencia, cdoc_tipdoc]
      )

      }
    });
    // Actualizar el grupo del documento en la tabla de tipo de documento

    await query(
      `UPDATE idosgd.si_mae_tipo_doc
      SET cdoc_grupo='02'
      WHERE cdoc_tipdoc=$1;`,
      [
        cdoc_tipdoc
      ]
    );
    
    return {
      status: 200,
      message: "Guardado correctamente.",
    };
  } catch (error) {
    console.error("Error al guardar el documento: ", error);
    return {
      status: 500,
      message: "Error al guardar el documento: " + error,
    };
  }
}

export async function removeDocument(cdoc_tipdoc: string) {
  try {
    await query(
      `UPDATE idosgd.si_mae_tipo_doc
      SET cdoc_grupo='01'
      WHERE cdoc_tipdoc=$1;`,
      [cdoc_tipdoc]
    );
    return {
      status: 200,
      message: "Guardado correctamente.",
    };
  } catch (error) {
    console.error("Error al quitar el documento: ", error);
    return {
      status: 500,
      message: "Error al quitar el documento: " + error,
    };
  }
}

export async function getDocumentsVerificaAll() {
  try {
    const result = await query<Option>(
      `SELECT cdoc_tipdoc as value, cdoc_desdoc as label
      FROM idosgd.si_mae_tipo_doc
      WHERE cdoc_grupo NOT IN ('1')
      ORDER BY cdoc_desdoc ASC;`,
      []
    );
    return result;
  } catch (error) {
    console.error("Error al obtener todos los documentos: ", error);
    return [];
  }
}

export async function getDocumentsVerif() {
  try {
    const result = await query(
      `SELECT cdoc_tipdoc, cdoc_desdoc
      FROM idosgd.si_mae_tipo_doc
      WHERE in_doc_salida='1'
      ORDER BY cdoc_desdoc ASC;`,
      []
    );
    return result;
  } catch (error) {
    console.error("Error al obtener los documentos del profesional: ", error);
    return [];
  }
}

export async function saveVerifDocument(cdoc_tipdoc: string) {
  try {
    await query(
      `UPDATE idosgd.si_mae_tipo_doc
      SET in_doc_salida='1'
      WHERE cdoc_tipdoc=$1;`,
      [cdoc_tipdoc]
    );
    return {
      status: 200,
      message: "Guardado correctamente.",
    };
  } catch (error) {
    console.error("Error al guardar el documento: ", error);
    return {
      status: 500,
      message: "Error al guardar el documento: " + error,
    };
  }
}

export async function removeVerifDocument(cdoc_tipdoc: string) {
  try {
    await query(
      `UPDATE idosgd.si_mae_tipo_doc
      SET in_doc_salida='0'
      WHERE cdoc_tipdoc=$1;`,
      [cdoc_tipdoc]
    );
    return {
      status: 200,
      message: "Guardado correctamente.",
    };
  } catch (error) {
    console.error("Error al quitar el documento: ", error);
    return {
      status: 500,
      message: "Error al quitar el documento: " + error,
    };
  }
}

export async function insertNewPlantillaDocumento(cdoc_desdoc: string) {
  try {
    // Obtener nuevo código para si_mae_tipo_doc
    const resultTipoDoc = await getDocumentsCod();
    const newTipdoc = String(Number(resultTipoDoc?.[0]?.max_tipdoc ?? 0) + 1).padStart(3, '0');

    // Insertar en si_mae_tipo_doc
    await query(
      `INSERT INTO idosgd.si_mae_tipo_doc (
        cdoc_tipdoc, cdoc_desdoc, cdoc_indbaj, fdoc_fecbaj, cdoc_grupo,
        in_numeracion, in_tipo_firma, in_doc_salida, in_multiple
      ) VALUES ($1, $2, 0, NULL, '01', 0, 2, 0, 0);`,
      [newTipdoc, cdoc_desdoc]
    );

    // Obtener nuevo código para tdtr_plantilla_docx
    const resultDocx = await getDocumentsCodDoc();
    const newCodDocx = String(Number(resultDocx?.[0]?.max_tipo_doc ?? 0) + 1).padStart(3, '0');
    const nom_archivo = `${cdoc_desdoc}.docx`;

    // Insertar en tdtr_plantilla_docx
    await query(
      `INSERT INTO idosgd.tdtr_plantilla_docx (
        co_tipo_doc, co_dep, bl_doc, nom_archivo,
        es_doc, fe_crea, us_crea, fe_modi, us_modi
      ) VALUES ($1, '00000', NULL, $2, '1', NULL, NULL, NULL, NULL);`,
      [newCodDocx, nom_archivo]
    );

    return {
      status: 200,
      message: "Ambos documentos insertados correctamente.",
    };
  } catch (error) {
    console.error("Error al insertar plantilla y documento:", error);
    return {
      status: 500,
      message: "Error al insertar los datos: " + error,
    };
  }
}



