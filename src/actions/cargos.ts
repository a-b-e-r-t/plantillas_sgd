"use server";

import { query } from '@/lib/db';

interface Option {
  ccar_descar: string;
  ccar_est_car: string;
  ccar_co_cargo: number;
}

export async function getNumeroCargo() {
  try {
    const result = await query<Option>(
      "SELECT CAST(ccar_co_cargo AS INTEGER) AS ccar_co_cargo FROM idosgd.rhtm_cargos ORDER BY ccar_co_cargo DESC LIMIT 1;",
      []
    );

    return result.length > 0 ? result[0].ccar_co_cargo : null;
  } catch (error) {
    console.error('Error al obtener los cargos:', error);
    return null;
  }
}

export async function getCargo() {
  try {
    const result = await query<Option>(
      "SELECT ccar_descar, ccar_est_car, ccar_co_cargo FROM idosgd.rhtm_cargos ORDER BY ccar_co_cargo DESC",
      []
    );

    // Map Option[] to Cargo[]
    return result.map(item => ({
      ccar_descar: item.ccar_descar,
      ccar_est_car: item.ccar_est_car,
      ccar_co_cargo: item.ccar_co_cargo.toString(), // Ensure it's a string
    }));
  } catch (error) {
    console.error('Error al obtener los cargos:', error);
    return [];
  }
}

export async function guardarCargo(ccar_descar: string, ccar_co_cargo: number) {


  let co_cargo: string = ''

  if (ccar_co_cargo.toString().length <= 4) {
    const zeros = '0'.repeat(4 - ccar_co_cargo.toString().length);
    co_cargo = zeros + ccar_co_cargo.toString()
  }

  console.log({ ccar_descar, co_cargo })

  try {
    await query(`
        INSERT INTO idosgd.rhtm_cargos
        (ccar_descar, ccar_est_car, ccar_co_cargo)
        VALUES($1, '1', $2);
      `, [ccar_descar.toUpperCase(), co_cargo]);

    console.log('Cargo guardado con éxito');
    return { success: true, message: 'Cargo guardado con éxito' };

  } catch (error) {
    console.error('Error al guardar el cargo:', error);
    return { success: false, message: 'Error al guardar el cargo', error };
  }
}

export async function eliminarCargo(co_cargo: string) {
  try {
    await query(`DELETE FROM idosgd.rhtm_cargos WHERE ccar_co_cargo=$1;`, [co_cargo]);
    return { success: true, message: 'Cargo eliminado con éxito' };
  } catch (error) {
    return { success: false, message: 'Error al eliminar el cargo', error };
  }
}

export async function actualizarCargo(nombre_cargo:string ,co_cargo: string) {
  try {
    await query(
      `UPDATE idosgd.rhtm_cargos
      SET ccar_descar=$1
      WHERE ccar_co_cargo=$2;`, 
      [nombre_cargo.toUpperCase(), co_cargo]);
    return { success: true, message: 'Cargo actualizado con éxito' };
  } catch (error) {
    return { success: false, message: 'Error al actualizar el cargo', error };
  }
}