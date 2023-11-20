import Image from "next/image";
import Link from "next/link";

import { LinkInt } from "@/interfaces/common";

interface CardProps {
  id: string;
  key: string;
  imageUrl: string;
  children: React.ReactNode;
  slug: string;
}

export default function CardProduct({
  id,
  imageUrl = "https://silano-3r.fra1.digitaloceanspaces.com/3r/eb7b1453f0328c5136fe884112e2b89c.jpg?updated_at=2023-02-16T10:32:29.892Z",
  children,
  slug,
}: CardProps) {
  return (
    <div
      id={id}
      className={`bg-neutral-100 w-full md:max-w-sm  rounded overflow-hidden shadow-lg flex flex-col`}
    >
      <Image
        className="w-full h-[220px] "
        src={imageUrl}
        width={600}
        height={400}
        alt="image-card"
        style={{ objectFit: "contain" }}
      />
      {/* Children */}
      <div className={`flex flex-col py-4 grow p-2`}>{children}</div>
      {/* Footer */}
      <div className="p-2 py-4">
        {" "}
        <Link
          href={`/ricambi/${slug}`}
          className="p-2 bg-forest text-white font-light uppercase rounded-sm"
        >
          Vedi il prodotto
        </Link>
      </div>
    </div>
  );
}
