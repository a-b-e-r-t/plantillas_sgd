import { getUsuariosCese } from "@/actions/usuarios";
import FechaCeseContainer from "./cese-container";
async function Page() {
  const usuarios = await getUsuariosCese();
  return (
    <main className="flex-1 overflow-y-auto">
      <FechaCeseContainer usuarios={usuarios} />
    </main>
  );
}

export default Page;
