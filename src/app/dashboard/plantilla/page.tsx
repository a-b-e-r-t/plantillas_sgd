import { getTemplatesData } from "@/actions/templates";
import PlantillaContainer from "./plantillas-container";

async function Page() {
  const plantillas = await getTemplatesData();

  if (!plantillas) {
    return <p>Error al cargar las plantillas.</p>;
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <PlantillaContainer documents={plantillas} />
    </main>
  );
}

export default Page;