import { getTemplatesData } from "@/actions/templates";
import Image from "next/image";

async function Page() {
  const plantillas = await getTemplatesData();

  if (!plantillas) {
    return <p>Error al cargar las plantillas.</p>;
  }

  return (
    <main className="flex-1 overflow-y-auto bg-card border p-4 rounded-lg">
      <div className="min-h-full flex gap-8">
        <div className="flex-1 flex flex-col justify-center gap-5">
          <div className="relative bg-card py-4 px-4 rounded-lg overflow-hidden shadow-[2px_2px_10px] shadow-chart-1">
            <div className="absolute left-0 top-0 w-2 h-full bg-chart-1"></div>
            <h2 className="font-semibold text-lg">Plantillas</h2>
            <p>En esta sección podrás realizar las siguientes acciones.</p>
            <ul className="list-disc pl-6 italic">
              <li>Visualización, descarga de plantillas cargadas.</li>
              <li>Carga de nuevas plantillas <strong>(.docx)</strong> de acuerdo al tipo de documento administrativo.</li>
              <li>Modificación de plantillas <strong>(.docx)</strong> de acuerdo al tipo de documento administrativo.</li>
            </ul>
          </div>
          <div className="relative bg-card py-4 px-4 rounded-lg overflow-hidden shadow-[2px_2px_10px] shadow-chart-2">
            <div className="absolute left-0 top-0 w-2 h-full bg-chart-2"></div>
            <h2 className="font-semibold text-lg">Correlativos</h2>
            <p>En esta sección podrás realizar las siguientes acciones.</p>
            <ul className="list-disc pl-6 italic">
              <li>Busqueda de correlativos, relacionado a usuario y tipo de documento.</li>
              <li>Modificación de correlativo según sea necesario, y previa generación de un documento de prueba.</li>
            </ul>
          </div>
          <div className="relative bg-card py-4 px-4 rounded-lg overflow-hidden shadow-[2px_2px_10px] shadow-chart-3">
            <div className="absolute left-0 top-0 w-2 h-full bg-chart-3"></div>
            <h2 className="font-semibold text-lg">Guía plantillas</h2>
            <p>En esta sección podrás encontrar la siguiente información.</p>
            <ul className="list-disc pl-6 italic">
              <li>Modelos de plantillas de documentos administrativos.</li>
              <li>Parámetros a incluir en una nueva plantilla.</li>
              <li>Descripción detallada de cada parámetro.</li>
            </ul>
          </div>
        </div>
        <div className="hidden md:block">
          <Image src={'/logos/inicio_claro.png'} alt="inicio" width={400} height={400} className="h-full object-cover dark:hidden"/>
          <Image src={'/logos/inicio_oscuro.png'} alt="inicio" width={400} height={400} className="h-full object-cover hidden dark:block"/>
        </div>
      </div>
    </main>
  );
}

export default Page;
