"use client";

import { useCart } from "@/app/store/useCart";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  ShoppingBagIcon, 
  ChevronLeftIcon, 
  CreditCardIcon, 
  TruckIcon, 
  UserIcon, 
  ShieldCheckIcon,
  InformationCircleIcon,
  BuildingOfficeIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";
import { toInteger, extractDecimal } from "@/lib/common";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal } = useCart();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerType, setCustomerType] = useState<"privato" | "azienda">("privato");
  const [shippingSameAsBilling, setShippingSameAsBilling] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    // Billing fields
    firstName: "",
    lastName: "",
    denominazione: "",
    billingAddress: "",
    billingHouseNumber: "",
    billingCity: "",
    billingZipCode: "",
    billingProvince: "",
    billingCountry: "Italia",
    vatNumber: "",
    sdiCode: "",
    pec: "",
    // Shipping fields
    address: "",
    houseNumber: "",
    city: "",
    zipCode: "",
    province: "",
    country: "Italia",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
          <ShoppingBagIcon className="w-10 h-10 text-gray-200" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Il carrello è vuoto</h1>
        <p className="text-gray-500 mb-8 font-medium">Aggiungi dei prodotti prima di procedere al checkout.</p>
        <Link 
          href="/ricambi" 
          className="bg-forest text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
        >
          Torna allo shopping
        </Link>
      </div>
    );
  }

  const shippingCost = 0; // Integrated in price
  const subtotal = getSubtotal();
  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = {
      ...formData,
      customerType,
      ...(shippingSameAsBilling ? {
        address: formData.billingAddress,
        houseNumber: formData.billingHouseNumber,
        city: formData.billingCity,
        zipCode: formData.billingZipCode,
        province: formData.billingProvince,
        country: formData.billingCountry,
      } : {})
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items,
          customerData: submissionData
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Errore durante la creazione del checkout: " + data.error);
      }
    } catch (error) {
      console.error("Errore checkout:", error);
      alert("Si è verificato un errore durante il checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/ricambi" className="flex items-center gap-2 text-gray-500 hover:text-forest transition-colors font-bold text-sm uppercase tracking-widest">
            <ChevronLeftIcon className="w-5 h-5" />
            <span>Indietro</span>
          </Link>
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="w-6 h-6 text-forest" />
            <span className="font-black text-gray-900 uppercase tracking-tighter">Secure Checkout</span>
          </div>
          <div className="w-20 lg:block hidden"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Side */}
          <div className="lg:col-span-8 space-y-12">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 uppercase tracking-tighter">
              Dati di <span className="text-forest">pagamento</span>
            </h1>

            {/* Section 1: Contatti */}
            <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-forest" />
                </div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Contatti</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email *</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tua@email.it"
                    className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Telefono *</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+39 333 000 0000"
                    className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Fatturazione */}
            <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <ShieldCheckIcon className="w-6 h-6 text-forest" />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Fatturazione</h2>
                </div>
                
                {/* Tabs */}
                <div className="flex bg-gray-50 p-1.5 rounded-2xl w-fit">
                  <button
                    type="button"
                    onClick={() => setCustomerType("privato")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      customerType === "privato" 
                      ? "bg-white text-forest shadow-sm" 
                      : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <UserCircleIcon className="w-4 h-4" />
                    Privato
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomerType("azienda")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      customerType === "azienda" 
                      ? "bg-white text-forest shadow-sm" 
                      : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <BuildingOfficeIcon className="w-4 h-4" />
                    Azienda
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customerType === "azienda" ? (
                  <>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Denominazione Azienda *</label>
                      <input
                        required
                        type="text"
                        name="denominazione"
                        value={formData.denominazione}
                        onChange={handleInputChange}
                        placeholder="Nome Società / Ditta Individuale"
                        className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome (Opzionale)</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cognome (Opzionale)</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Partita IVA *</label>
                      <input
                        required
                        type="text"
                        name="vatNumber"
                        value={formData.vatNumber}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Codice SDI *</label>
                      <input
                        required
                        type="text"
                        name="sdiCode"
                        value={formData.sdiCode}
                        onChange={handleInputChange}
                        placeholder="7 caratteri"
                        className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">PEC (Opzionale)</label>
                      <input
                        type="email"
                        name="pec"
                        value={formData.pec}
                        onChange={handleInputChange}
                        placeholder="email@pec.it"
                        className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome *</label>
                      <input
                        required
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cognome *</label>
                      <input
                        required
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                      />
                    </div>
                  </>
                )}

                <div className="md:col-span-2 space-y-2">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Indirizzo Fatturazione *</label>
                      <input
                        required
                        type="text"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleInputChange}
                        placeholder="Via / Piazza / Viale"
                        className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                      />
                    </div>
                    <div className="col-span-1 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Civico *</label>
                      <input
                        required
                        type="text"
                        name="billingHouseNumber"
                        value={formData.billingHouseNumber}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CAP *</label>
                  <input
                    required
                    type="text"
                    name="billingZipCode"
                    value={formData.billingZipCode}
                    onChange={handleInputChange}
                    className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Città *</label>
                  <input
                    required
                    type="text"
                    name="billingCity"
                    value={formData.billingCity}
                    onChange={handleInputChange}
                    className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Provincia *</label>
                  <input
                    required
                    type="text"
                    name="billingProvince"
                    placeholder="Sigla (es. RM)"
                    value={formData.billingProvince}
                    onChange={handleInputChange}
                    maxLength={2}
                    className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900 uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nazione</label>
                  <select
                    name="billingCountry"
                    value={formData.billingCountry}
                    onChange={handleInputChange}
                    className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                  >
                    <option value="Italia">Italia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Spedizione */}
            <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <TruckIcon className="w-6 h-6 text-forest" />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Spedizione</h2>
                </div>
                
                <label className="flex items-center gap-3 cursor-pointer bg-gray-50 px-6 py-4 rounded-2xl">
                  <input
                    type="checkbox"
                    checked={shippingSameAsBilling}
                    onChange={(e) => setShippingSameAsBilling(e.target.checked)}
                    className="w-6 h-6 rounded-lg text-forest border-gray-200 focus:ring-forest/20"
                  />
                  <span className="text-sm font-black text-gray-900 uppercase tracking-tight">Uguale a fatturazione</span>
                </label>
              </div>

              {!shippingSameAsBilling && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="md:col-span-2 space-y-2">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-3 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Indirizzo Spedizione *</label>
                        <input
                          required={!shippingSameAsBilling}
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Via / Piazza / Viale"
                          className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                        />
                      </div>
                      <div className="col-span-1 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Civico *</label>
                        <input
                          required={!shippingSameAsBilling}
                          type="text"
                          name="houseNumber"
                          value={formData.houseNumber}
                          onChange={handleInputChange}
                          className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CAP *</label>
                    <input
                      required={!shippingSameAsBilling}
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Città *</label>
                    <input
                      required={!shippingSameAsBilling}
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Provincia *</label>
                    <input
                      required={!shippingSameAsBilling}
                      type="text"
                      name="province"
                      placeholder="Sigla"
                      value={formData.province}
                      onChange={handleInputChange}
                      maxLength={2}
                      className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900 uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nazione</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-forest/20 transition-all font-medium text-gray-900"
                    >
                      <option value="Italia">Italia</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary Side */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-50 space-y-8">
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Il tuo ordine</h3>
                
                {/* Items List */}
                <div className="space-y-6 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col justify-center flex-1">
                        <h4 className="text-xs font-black text-gray-900 leading-tight line-clamp-2">{item.title}</h4>
                        <p className="text-[10px] text-gray-400 uppercase font-bold mt-0.5">Qtà: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-black text-forest self-center">
                        € {item.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sottototale</span>
                    <span className="text-lg font-bold text-gray-900">€ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Spedizione</span>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Gratuita</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">Totale Finale</span>
                    <div className="flex items-baseline gap-0.5 text-forest">
                      <span className="text-3xl font-black">€ {toInteger(total)}</span>
                      <span className="text-lg font-bold">{extractDecimal(total)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-forest text-white rounded-2xl font-black text-lg uppercase tracking-wide shadow-lg hover:bg-forest/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Paga Ora
                      <CreditCardIcon className="w-6 h-6" />
                    </>
                  )}
                </button>
                
                <div className="flex flex-col items-center gap-4 pt-4">
                  <div className="flex items-center gap-3 opacity-50 grayscale">
                    <Image src="/carte.webp" alt="Pagamenti" width={180} height={30} unoptimized />
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium text-center leading-relaxed">
                    Pagamento sicuro tramite Mollie 256-bit SSL.<br />
                    Riceverai la conferma d&apos;ordine via email.
                  </p>
                </div>
              </div>

              {/* Info box */}
              <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <InformationCircleIcon className="w-6 h-6 text-forest" />
                  <span className="font-bold uppercase text-xs tracking-widest">Garanzia Silano</span>
                </div>
                <p className="text-xs leading-relaxed text-gray-400">
                  Ogni nostro ricambio è accuratamente testato e verificato dai nostri tecnici prima della spedizione. 
                  Hai 14 giorni per il reso se il prodotto non è conforme.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
