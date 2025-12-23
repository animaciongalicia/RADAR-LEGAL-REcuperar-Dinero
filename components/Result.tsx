
import React from 'react';
import { LeadData, ScoringResult } from '../types';
import { APP_CONFIG, CHECKLIST_ITEMS } from '../constants';
import { generateRadarPDF } from '../utils/pdf';

interface ResultProps {
  data: LeadData;
  results: ScoringResult;
}

const Result: React.FC<ResultProps> = ({ data, results }) => {
  const handleDownload = async () => {
    const pdfBytes = await generateRadarPDF(data, results);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dictamen-Estrategico-${data.full_name.replace(/\s+/g, '-')}.pdf`;
    link.click();
  };

  const colorStyles = {
    green: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      accent: 'bg-emerald-600',
      label: 'Viabilidad Alta',
      status: 'Expediente Prioritario',
      desc: 'Su caso es técnicamente sólido. Con nuestra intervención inmediata, el deudor tiene pocas vías de escape legales para evitar el pago.'
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      accent: 'bg-amber-600',
      label: 'Viabilidad Media',
      status: 'Requiere Blindaje Profesional',
      desc: 'Hay base legal, pero existen "puntos de fuga" en la prueba que el deudor usará para retrasar el cobro si no actuamos con rigor técnico.'
    },
    red: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-700',
      accent: 'bg-rose-600',
      label: 'Viabilidad Compleja',
      status: 'Intervención de Rescate',
      desc: 'El escenario es difícil, pero no imposible. Necesitamos una estrategia de negociación agresiva para salvar parte o la totalidad del capital.'
    }
  }[results.color];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-8">
      {/* Header Informe */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200 shadow-sm">
          <svg className="w-3 h-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          Dictamen Estratégico Profesional
        </div>
        <h1 className="text-4xl font-serif text-slate-900 mb-2">Análisis de Recuperación</h1>
        <p className="text-slate-500 font-medium">Preparado exclusivamente para {data.full_name}</p>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* Sección 1: Datos del Caso */}
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">I. Resumen del Expediente</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-xs text-slate-400">Titular</span>
              <span className="text-sm font-semibold text-slate-800">{data.full_name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-xs text-slate-400">Principal Adeudado</span>
              <span className="text-sm font-bold text-slate-900">{data.claim_amount.toLocaleString('es-ES')} €</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-xs text-slate-400">Sector / Tipo</span>
              <span className="text-sm font-medium text-slate-700 capitalize">{data.case_type} - {data.debtor_type}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-xs text-slate-400">Estado de Alerta</span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${colorStyles.bg} ${colorStyles.text}`}>
                {results.color === 'green' ? 'Prioridad Alta' : 'Vigilancia'}
              </span>
            </div>
          </div>
        </section>

        {/* Sección 2: Análisis de Viabilidad */}
        <section className={`p-8 rounded-3xl border ${colorStyles.border} ${colorStyles.bg} relative shadow-inner`}>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${colorStyles.accent}`}></div>
              <span className={`text-xs font-bold uppercase tracking-widest ${colorStyles.text}`}>{colorStyles.label}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{colorStyles.status}</h2>
            <p className="text-slate-700 mb-8 leading-relaxed italic text-sm">"{colorStyles.desc}"</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-200/60">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Índice de Fortaleza Jurídica</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-slate-900">{results.score}</span>
                  <span className="text-lg font-medium text-slate-400">/100</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 leading-tight">Este índice mide la capacidad de forzar el pago mediante herramientas legales coercitivas.</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Proyección Total Recuperable</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  {results.minRecoverable.toLocaleString('es-ES')}€ - {results.maxRecoverable.toLocaleString('es-ES')}€
                </p>
                <div className="mt-3 p-3 bg-white/50 rounded-xl border border-white/80">
                  <p className="text-[10px] text-slate-600 leading-normal">
                    <strong>¿Por qué este rango?</strong> No solo reclamamos el principal. Nuestra gestión profesional busca incluir <strong>intereses de demora</strong> y la posible condena en <strong>costas</strong>, minimizando que usted tenga que aceptar "quitas" que reduzcan su dinero.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 3: Hoja de Ruta Persuasiva */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-sm font-serif">II</span>
            Nuestro Plan de Acción Estratégico
          </h3>
          <div className="space-y-8 relative">
            <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-100 hidden md:block"></div>
            {results.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-4 items-start relative z-10 group">
                <div className="w-8 h-8 shrink-0 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-400 group-hover:border-indigo-500 group-hover:text-indigo-600 transition-all shadow-sm">
                  {i + 1}
                </div>
                <div className="bg-slate-50/50 p-4 rounded-xl border border-transparent group-hover:border-slate-100 group-hover:bg-white transition-all w-full">
                  <h4 className="text-sm font-bold text-slate-800 mb-1">{rec.split(':')[0]}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{rec.split(':')[1]}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-indigo-50/30 rounded-xl border border-indigo-100 text-center">
            <p className="text-xs text-indigo-900 font-medium">
              "Usted no tiene que enfrentarse al deudor. Nosotros nos encargamos de toda la presión técnica y legal para que recupere su tiempo y su capital."
            </p>
          </div>
        </section>

        {/* Sección 4: Auditoría Documental - REFINADA */}
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">III. Auditoría Documental</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CHECKLIST_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 px-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                <div className="w-4 h-4 border border-slate-300 rounded shrink-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full"></div>
                </div>
                <span className="text-xs text-slate-600 font-medium">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[11px] text-slate-400 text-center leading-relaxed">
            Nuestro equipo analizará la validez jurídica de cada documento para evitar impugnaciones del deudor. 
            <strong> Cuanta más prueba aportemos, menor será el tiempo de cobro.</strong>
          </p>
        </section>

        {/* Call to Actions Finales */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="text-center mb-2">
            <h4 className="text-sm font-bold text-slate-800">Siguiente paso recomendado:</h4>
          </div>
          
          <a 
            href={`https://wa.me/${APP_CONFIG.whatsappPhone}?text=Hola, soy ${data.full_name}. He recibido mi Dictamen Profesional (Importe: ${data.claim_amount}€). Deseo iniciar la fase de auditoría técnica para recuperar mi capital lo antes posible.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-5 bg-indigo-600 text-white text-center rounded-xl font-bold hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transform hover:scale-[1.01]"
          >
            Activar Recuperación Profesional (WhatsApp)
          </a>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              onClick={handleDownload}
              className="py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Dictamen PDF
            </button>
            <a 
              href={APP_CONFIG.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 bg-slate-100 text-slate-700 text-center rounded-xl font-bold hover:bg-slate-200 transition text-sm"
            >
              Cita Estratégica 15 min
            </a>
          </div>
        </div>

        <div className="text-center pt-10 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 leading-relaxed max-w-lg mx-auto uppercase tracking-[0.2em] font-bold">
              Compromiso • Transparencia • Resultados Jurídicos
            </p>
        </div>
      </div>
    </div>
  );
};

export default Result;
