import GuiaPlantillaTable from "@/components/table/guia-plantilla-table";
import GuiaTable from "@/components/table/guia-table";
import { guiaPlantillas, guiaPlantillasDocs } from "@/utils/guia";

function Page() {
  return (
    <main className="flex-1 space-y-4 overflow-y-auto">
      <GuiaTable guias={guiaPlantillas}/>
      <GuiaPlantillaTable documents={guiaPlantillasDocs}/>
    </main>
  )
}

export default Page;
