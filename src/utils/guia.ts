interface Guia {
  param: string
  desc: string
}

interface Document {
  name: string
  src: string
}

export const guiaPlantillas: Guia[] = [
  { param: "${DEPENDENCIA_TITULO_PADRE}", desc: "Nombre de la dependencia padre a la que pertenece." },
  { param: "«${DEPENDENCIA_TITULO}»", desc: "Nombre de la dependencia." },
  { param: "«${NOMBRE_ANIO2}»", desc: "Nombre del año en curso que se maneja dentro de la institución." },
  { param: "«${NOMBRE_ANIO}»", desc: "Nombre del año en curso." },
  { param: "«${EMPLEADO_DESTINO}»", desc: "Nombre del empleado a quien va dirigido el documento." },
  { param: "«${CARGO_EMP_DESTINO}»", desc: "Cargo del empleado a quien va dirigido el documento." },
  { param: "«${DEPENDENCIA_DESTINO}»", desc: "Nombre de la dependencia destinataria." },
  { param: "«${EMPLEADO_EMITE}»", desc: "Nombre del empleado que emite el documento." },
  { param: "«${CARGO_EMP_EMITE}»", desc: "Cargo del empleado que emite el documento." },
  { param: "«${DEPENDENCIA_EMITE}»", desc: "Nombre de la dependencia que emite el documento." },
  { param: "«${ASUNTO}»", desc: "Asunto del documento." },
  { param: "«${REFERENCIA}»", desc: "Referencia a otro documento existente en el SGD." },
  { param: "«${FECHA_DOC}» ", desc: "Fecha de emisión del documento." },
  { param: "«${INICIALES_EMP}»", desc: "Iniciales del nombre del empledo que emite el documento." },
  { param: "«${COPIA}»", desc: "Con copia." },
  { param: "«${NOMBRE_DESTINATARIO}»", desc: "Nombre del destinatario." },
  { param: "«${CARGO}»", desc: "Cargo del destinatario." },
  { param: "«${ENTIDAD_PRIVADA_DESTINATARIO}»", desc: "Nombre de entidad privada destinataria." },
  { param: "«${DIRECCION_DESTINATARIO}» ", desc: "Dirección del destinatario." },
  { param: "«${URL_WEB_VERIFICA}»", desc: "Url de verificación de documentos firmados en el SGD. (Que normalmente se colocan en el pie de página del documento.)" },
  { param: "«${CO_VER_EXT}»", desc: "Código de verificación. (Que normalmente se colocan en el pie de página del documento.)" },
]

export const guiaPlantillasDocs: Document[] = [
  { name: "Plantilla de CARTA", src: "/guias/CARTA.docx" },
  { name: "Plantilla de INFORME TÉCNICO", src: "/guias/INFORME-TECNICO.docx" },
  { name: "Plantilla de INFORME", src: "/guias/INFORME.docx" },
  { name: "Plantilla de MEMORANDO MÚLTIPLE", src: "/guias/MEMORANDO-MULTIPLE.docx" },
  { name: "Plantilla de MEMORANDO", src: "/guias/MEMORANDO.docx" },
  { name: "Plantilla de OFICIO MÚLTIPLE", src: "/guias/OFICIO-MULTIPLE.docx" },
  { name: "Plantilla de OFICIO", src: "/guias/OFICIO.docx" },
]