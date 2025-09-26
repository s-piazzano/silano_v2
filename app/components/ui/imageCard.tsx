import Image from "next/image";

type GridProps = {
  image: string;
  title: string;
};

export default function ImageCard({ image, title }: GridProps) {
  return (
    <div className="relative w-full min-h-96 overflow-hidden shadow-lg rounded-xl">
      {/* immagine come background */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
      />

      {/* overlay semi-trasparente in basso */}
      <div className={title ? 'absolute inset-x-0 bottom-0 bg-black/50 px-4 py-2' : 'hidden'}>
        <p className="text-white text-lg font-semibold">{title}</p>
      </div>
    </div>
  );
}
