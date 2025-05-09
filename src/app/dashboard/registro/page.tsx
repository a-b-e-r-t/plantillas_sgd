import DocumentoContainer from "./registro-container";
import { getTemplatesData } from "@/actions/templates";

async function Page() {
  const plantillas = await getTemplatesData();

  if (!plantillas) {
    return <p>Error al cargar las plantillas.</p>;
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <DocumentoContainer />
    </main>
  )
}

export default Page;

