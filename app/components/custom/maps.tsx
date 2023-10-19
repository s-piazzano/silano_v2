"use client"

interface MapsProps {
  width?: number;
  height: number;
  className?: string;
}

export default function Maps({ width, height, className }: MapsProps) {
  return (
    <div className={`w-full ${className}`}>
      {/*  <h1 className="text-xl font-bold mb-4">Vieni a trovarci</h1> */}
      <div className="w-full flex justify-center">
        {/* <div className="hidden lg:flex lg:flex-col lg:justify-between lg:w-1/3 flex-shrink-0">
            <div className="bg-base-200 bg-opacity-30 p-2 shadow rounded-sm">
              <h4>SILANO | 1986</h4>
              <p className="m">
                La ditta Silano nasce nel 1986 con il fondatore Mauro Silano, al
                quale si uniscono i figli Giulia e Alberto nei primi anni 2000
                consolidando l'impresa - che diventa Società - e ampliando i
                servizi proposti per poter essere sempre al passo delle richieste
                dei clienti.
              </p>
            </div>
  
          </div> */}
        <iframe
          title="whereweare"
          className="w-full shadow"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2803.1638649489246!2d8.130221315554195!3d45.36568827909993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786325e10f5ac6b%3A0xb1064ec6142248e8!2sSilano%20Srl!5e0!3m2!1sit!2sit!4v1670600026007!5m2!1sit!2sit"
          width={width}
          height={height}
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
