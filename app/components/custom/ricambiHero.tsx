"use client";

import { MagnifyingGlassIcon, UserIcon, WrenchIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

interface RicambiHeroProps {
  title: string;
  description: string;
  currentStep?: number;
  brandName?: string;
  modelName?: string;
  subCategoryName?: string;
}

export default function RicambiHero({ 
  title, 
  description, 
  currentStep = 1,
  brandName,
  modelName,
  subCategoryName
}: RicambiHeroProps) {
  const isStep1Active = currentStep >= 1;
  const isStep2Active = currentStep >= 2;
  const isStep3Active = currentStep >= 3;

  return (
    <div className="relative mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex-1">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl">
            {description}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Step 1: Marca */}
            <button 
              onClick={() => {
                if (currentStep > 1) {
                  window.location.href = '/ricambi';
                } else {
                  document.getElementById('marche-popolari')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`flex items-center gap-3 p-4 rounded-lg border transition-all w-full text-left ${
                currentStep === 1 
                  ? 'bg-forest/5 border-forest/20' 
                  : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
              }`}
            >
              <div className={`p-2 rounded-full shadow-sm transition-all ${
                isStep1Active ? 'bg-forest text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <span className="font-bold">1</span>
              </div>
              <div className="flex flex-col">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${isStep1Active ? 'text-forest/60' : 'text-gray-400'}`}>
                  Marca
                </span>
                <span className={`text-sm font-bold truncate ${isStep1Active ? 'text-forest' : 'text-gray-700'}`}>
                  {brandName || 'Scegli Marca'}
                </span>
              </div>
            </button>

            {/* Step 2: Modello */}
            <button 
              onClick={() => {
                if (currentStep === 2) {
                  document.getElementById('selezione-modelli')?.scrollIntoView({ behavior: 'smooth' });
                } else if (currentStep > 2) {
                  // Se sono nello step 3, tornare alla selezione modelli della stessa marca
                  const pathParts = window.location.pathname.split('/');
                  const makeSlug = pathParts[3]; // /ricambi/catalogo/[make]/...
                  window.location.href = `/ricambi/catalogo/${makeSlug}`;
                }
              }}
              className={`flex items-center gap-3 p-4 rounded-lg border transition-all w-full text-left ${
                currentStep === 2 
                  ? 'bg-forest/5 border-forest/20 cursor-pointer hover:bg-forest/10' 
                  : currentStep > 2 
                    ? 'bg-gray-50 border-gray-100 cursor-pointer hover:bg-gray-100'
                    : 'bg-gray-50 border-gray-100 cursor-default opacity-60'
              }`}
            >
              <div className={`p-2 rounded-full shadow-sm transition-all ${
                isStep2Active ? 'bg-forest text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <span className="font-bold">2</span>
              </div>
              <div className="flex flex-col">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${isStep2Active ? 'text-forest/60' : 'text-gray-400'}`}>
                  Modello
                </span>
                <span className={`text-sm font-bold truncate ${isStep2Active ? 'text-forest' : 'text-gray-700'}`}>
                  {modelName || 'Scegli Modello'}
                </span>
              </div>
            </button>

            {/* Step 3: Ricambio */}
            <button 
              onClick={() => {
                if (currentStep === 3) {
                  document.getElementById('selezione-categorie')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`flex items-center gap-3 p-4 rounded-lg border transition-all w-full text-left ${
                currentStep === 3 
                  ? 'bg-forest/5 border-forest/20 cursor-pointer hover:bg-forest/10' 
                  : 'bg-gray-50 border-gray-100 cursor-default opacity-60'
              }`}
            >
              <div className={`p-2 rounded-full shadow-sm transition-all ${
                isStep3Active ? 'bg-forest text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <span className="font-bold">3</span>
              </div>
              <div className="flex flex-col">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${isStep3Active ? 'text-forest/60' : 'text-gray-400'}`}>
                  Ricambio
                </span>
                <span className={`text-sm font-bold ${isStep3Active ? 'text-forest' : 'text-gray-700'}`}>
                  {subCategoryName || 'Trova Ricambio'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
