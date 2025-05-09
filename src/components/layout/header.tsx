import { ModeChange } from "@/components/mode-change";
import Image from "next/image";
import AvatarUser from "@/components/avatar-user";
import Link from "next/link";
function Header() {
  return (
    <div className="bg-card p-5 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link href={"/dashboard"} className="flex gap-2">
          <Image src={"/logos/inicio_claro.png"} alt="logo-gra" width={30} height={30} className="dark:hidden" />
          <Image src={"/logos/inicio_oscuro.png"} alt="logo-gra" width={30} height={30} className="hidden dark:block" />
          <div className="">
            <h1 className="hidden lg:block text-base font-bold">GOBIERNO REGIONAL DE</h1>
            <h1 className="hidden lg:block text-base font-bold">AYACUCHO</h1>
          </div>
        </Link>
        <h1 className="text-2xl font-semibold hidden md:block text-center">Configuración de documentos del SGD</h1>
        <div className="flex items-center justify-end gap-4">
          <ModeChange />
          <AvatarUser />
        </div>
      </div>
    </div>
  );
}

export default Header;
