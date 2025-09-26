"use client";

export default function MoreInfoButton() {
  const handleClick = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSfCtc2ZQREvLjwbtE87UXg_v6xPS_ULhuB-GvTlCz_-nO0bqA/viewform?usp=sharing&ouid=106668016706184160188",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="w-full flex justify-center my-8">
      <button
        onClick={handleClick}
        className=" px-6 py-3 bg-forest text-white font-medium shadow-md hover:bg-forest/90 transition cursor-pointer"
      >
        Richiedi un preventivo
      </button>
    </div>
  );
}
