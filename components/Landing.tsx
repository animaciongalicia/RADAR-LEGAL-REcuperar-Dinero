
import React from 'react';
import { APP_CONFIG } from '../constants';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
          Impagos y Reclamaciones
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 mb-6 leading-tight">
          ¿Te deben dinero?
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Si esperas, pierdes fuerza. En 3 minutos te digo si tu reclamación es viable y qué te falta para reclamar con ventaja.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-16">
          <button 
            onClick={onStart}
            className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition shadow-lg shadow-slate-200"
          >
            Empezar Diagnóstico
          </button>
          <a 
            href={`https://wa.me/${APP_CONFIG.whatsappPhone}?text=Hola, quiero consultar un caso de impago`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition"
          >
            Hablar por WhatsApp
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { title: "Semáforo de viabilidad", text: "Diagnóstico inmediato de posibilidades reales." },
            { title: "Checklist técnico", text: "Lista de documentos necesarios para ganar." },
            { title: "Próximo paso", text: "Recomendación estratégica sin humo ni rodeos." }
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
