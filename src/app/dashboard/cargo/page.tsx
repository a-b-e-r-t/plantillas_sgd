import { getNumeroCargo } from "@/actions/cargos";
import { getCargo } from "@/actions/cargos";
import CargoContainer from "./cargo-container";

async function Page() {
  const numeroCargo = await getNumeroCargo();
  const cargosGeneral = await getCargo();
  return (
    <main className="flex-1 overflow-y-auto">
      <CargoContainer
        number={numeroCargo ? numeroCargo + 1 : 0}
        cargos={cargosGeneral}
      />
    </main>
  );
}

export default Page;
