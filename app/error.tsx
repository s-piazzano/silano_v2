"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="w-full">
      <div className="h-screen flex flex-col justify-center items-center -mt-20">
        <h2>Qualcosa è andato storto!</h2>
        <button
          className="bg-forest border-rounded-md p-2"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Prova di nuovo
        </button>
      </div>
    </div>
  );
}
