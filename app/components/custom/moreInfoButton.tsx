"use client"

import Link from "next/link";

export default function MoreInfoButton() {
    return (
        < div className = "w-full flex justify-center" >

            <Link href="https://docs.google.com/forms/d/e/1FAIpQLSfCtc2ZQREvLjwbtE87UXg_v6xPS_ULhuB-GvTlCz_-nO0bqA/viewform?usp=sharing&ouid=106668016706184160188" className="inline-block mt-4 px-4 py-2 bg-forest text-white transition" >Richiedi un preventivo</Link>
        </div >)
}