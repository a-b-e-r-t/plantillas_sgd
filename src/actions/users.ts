"use server";

import { query } from '@/lib/db';

interface Usuario {
  value: string;
  label: string;
}

export async function getUsers(){
  try {
    const result = await query<Usuario>('SELECT cod_user as value, cdes_user as label, cclave FROM idosgd.seg_usuarios1;', []);
    return result;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return [];
  }
}