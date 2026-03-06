import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full">
      <div className="h-screen flex flex-col justify-center items-center -mt-20">
        <h1 className="text-8xl font-light">404</h1>
        <h1 className="text-xl font-extralight">
          Ops, la pagina non è stata trovata
        </h1>
        <Link href="/" className="mt-8">
          Torna alla pagina principale
        </Link>
      </div>
    </div>
  );
}
