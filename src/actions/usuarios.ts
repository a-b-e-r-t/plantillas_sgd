"use server";

import { query } from "@/lib/db";

interface UsuarioDB {
  id_usuario: string;
  nombre_usuario: string;
  fecha_fin: string | null;
}

export async function getUsuariosCese() {
  try {
    const result = await query<UsuarioDB>(
      `SELECT cod_user as id_usuario, cdes_user as nombre_usuario, fecha_fin 
       FROM idosgd.seg_usuarios1 
       ORDER BY nombre_usuario ASC;`,
      []
    );

    return result.map((usuario) => ({
      id: usuario.id_usuario,
      nombre: usuario.nombre_usuario,
      fecha_fin: usuario.fecha_fin,
    }));
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
}

export async function agregarUsuarioCese(nombre: string, fecha: Date) {
  try {
    await query(
      `INSERT INTO idosgd.seg_usuarios1 (cdes_user, fecha_fin,) 
       VALUES ($1, $2);`,
      [nombre.toUpperCase(), fecha]
    );

    return { success: true, message: "Usuario agregado con éxito" };
  } catch (error) {
    console.error("Error al agregar usuario:", error);
    return { success: false, message: "Error al agregar usuario", error };
  }
}

export async function actualizarFechaCese(id: string, fecha: Date) {
  try {
    await query(
      `UPDATE idosgd.seg_usuarios1 
       SET fecha_fin = $1 
       WHERE cod_user = $2;`,
      [fecha, id]
    );

    return { success: true, message: "Fecha de cese actualizada" };
  } catch (error) {
    console.error("Error al actualizar fecha de cese:", error);
    return { success: false, message: "Error al actualizar fecha", error };
  }
}
