type GridProps = {
  image: string;
  title: string;
};

export default function ImageCard({ image, title }: GridProps) {
  return (
    <div
      className="relative w-full h-72  overflow-hidden shadow-lg"
      style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* overlay semi-trasparente in basso */}
      <div className="absolute inset-x-0 bottom-0 bg-black/50 px-4 py-2">
        <p className="text-white text-lg font-semibold">{title}</p>
      </div>
    </div>
  );
}
