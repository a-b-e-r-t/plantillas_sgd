"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function MainRoute() {
  const pathname = usePathname();

  return (
    <div className="bg-card px-4 py-2 rounded-lg flex gap-4 border flex-wrap">
      <Link
        href={"/dashboard/plantilla"}
        className={`font-semibold hover:text-primary ${
          pathname === "/dashboard/plantilla"
            ? "border py-1 px-4 rounded-md border-primary text-primary hover:text-primary"
            : "bg-secondary py-1 px-4 rounded-md hover:text-primary"
        }`}>
        Plantillas
      </Link>
      <Link
        href={"/dashboard/correlativo"}
        className={`font-semibold hover:text-primary ${
          pathname === "/dashboard/correlativo"
            ? "border py-1 px-4 rounded-md border-primary text-primary hover:text-primary"
            : "bg-secondary py-1 px-4 rounded-md hover:text-primary"
        }`}>
        Correlativos
      </Link>
      <Link
        href={"/dashboard/documento"}
        className={`font-semibold hover:text-primary ${
          pathname === "/dashboard/documento"
            ? "border py-1 px-4 rounded-md border-primary text-primary hover:text-primary"
            : "bg-secondary py-1 px-4 rounded-md hover:text-primary"
        }`}>
        Documentos profesional
      </Link>
      <Link
        href={"/dashboard/doc-verifica"}
        className={`font-semibold hover:text-primary ${
          pathname === "/dashboard/doc-verifica"
            ? "border py-1 px-4 rounded-md border-primary text-primary hover:text-primary"
            : "bg-secondary py-1 px-4 rounded-md hover:text-primary"
        }`}>
        Documentos verifica
      </Link>
      <Link
        href={"/dashboard/guia"}
        className={`font-semibold hover:text-primary ${
          pathname === "/dashboard/guia"
            ? "border py-1 px-4 rounded-md border-primary text-primary hover:text-primary"
            : "bg-secondary py-1 px-4 rounded-md hover:text-primary"
        }`}>
        Guia plantillas
      </Link>
      <Link
        href={"/dashboard/cargo"}
        className={`font-semibold hover:text-primary ${
          pathname === "/dashboard/cargo"
            ? "border py-1 px-4 rounded-md border-primary text-primary hover:text-primary"
            : "bg-secondary py-1 px-4 rounded-md hover:text-primary"
        }`}>
        Cargos
      </Link>
      <Link
        href={"/dashboard/cese"}
        className={`font-semibold hover:text-primary ${
          pathname === "/dashboard/cese"
            ? "border py-1 px-4 rounded-md border-primary text-primary hover:text-primary"
            : "bg-secondary py-1 px-4 rounded-md hover:text-primary"
        }`}>
        Cese
      </Link>
    </div>
  );
}

export default MainRoute;
