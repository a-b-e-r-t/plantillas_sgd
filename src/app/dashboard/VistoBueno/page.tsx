import VistoBueno from "./VistoBueno_container";
import { getTemplatesData } from "@/actions/templates";

async function Page() {
  const plantillas = await getTemplatesData();

  if (!plantillas) {
    return <p>Error al cargar las vistas.</p>;
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <VistoBueno />
    </main>
  );
}

export default Page;
