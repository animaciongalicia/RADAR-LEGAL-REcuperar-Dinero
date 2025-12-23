
import React, { useState, useEffect } from 'react';
import { LeadData, LeadSchema, UTMParams } from '../types';
import { APP_CONFIG } from '../constants';
import { calculateScore } from '../utils/scoring';

interface WizardProps {
  onComplete: (data: LeadData) => void;
}

const Wizard: React.FC<WizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(2); // Start from screen 2
  const [data, setData] = useState<Partial<LeadData>>({
    evidence: [],
    consent_privacy: false,
    consent_contact: false
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleUpdate = (updates: Partial<LeadData>) => {
    setData(prev => ({ ...prev, ...updates }));
    setError(null);
  };

  const handleEvidenceToggle = (item: string) => {
    const current = data.evidence || [];
    if (current.includes(item)) {
      handleUpdate({ evidence: current.filter(i => i !== item) });
    } else {
      handleUpdate({ evidence: [...current, item] });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Validar con Zod
      const validated = LeadSchema.parse(data);
      
      // Simular delay de análisis
      setStep(9);
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      onComplete(validated);
    } catch (err: any) {
      console.error("Errores de validación:", err.errors);
      setError("Faltan datos obligatorios o hay errores en el formulario. Por favor, revisa todos los pasos.");
      setIsSubmitting(false);
      // Opcional: Volver al paso 8 si hay error
      setStep(8);
    }
  };

  const progress = (step / 10) * 100;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 min-h-[600px] flex flex-col">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Paso {step} de 10</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="flex-1">
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-serif text-slate-900 mb-4">Esto no es un formulario. Es un filtro serio.</h2>
            <p className="text-slate-600 mb-8">Responde 8 preguntas. Con eso generamos un pre-diagnóstico. Si sale viable, te decimos el camino más rápido.</p>
            <div className="flex flex-wrap gap-2 mb-12">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded">Tiempo: 3 min</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded">Privado y confidencial</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded">Enfoque práctico</span>
            </div>
            <button onClick={nextStep} className="w-full py-4 bg-slate-900 text-white rounded-lg font-bold">Continuar</button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in">
            <h2 className="text-2xl font-serif text-slate-900 mb-6">¿Qué te deben exactamente?</h2>
            <div className="space-y-3">
              {[
                { val: 'factura', label: 'Factura/servicio a empresa (impago)' },
                { val: 'particular', label: 'Cliente particular (impago)' },
                { val: 'anticipo', label: 'Señal/anticipo no devuelto' },
                { val: 'otro', label: 'Otro (resumen)' }
              ].map(opt => (
                <label key={opt.val} className={`block p-4 border rounded-xl cursor-pointer transition ${data.case_type === opt.val ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="case_type" className="hidden" onChange={() => handleUpdate({ case_type: opt.val as any })} />
                  <span className="font-medium text-slate-800">{opt.label}</span>
                </label>
              ))}
            </div>
            {data.case_type === 'otro' && (
              <textarea 
                className="w-full mt-4 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Describe en 1 frase qué ha pasado..."
                onChange={(e) => handleUpdate({ case_type_other: e.target.value })}
              />
            )}
            <div className="flex gap-4 mt-8">
              <button onClick={prevStep} className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-lg font-bold">Atrás</button>
              <button disabled={!data.case_type} onClick={nextStep} className="flex-[2] py-4 bg-slate-900 text-white rounded-lg font-bold disabled:opacity-50">Siguiente</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in">
            <h2 className="text-2xl font-serif text-slate-900 mb-6">Dame números (sin números, no hay diagnóstico).</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Importe aproximado (€)</label>
                <input 
                  type="number" 
                  className="w-full p-4 border border-slate-200 rounded-xl"
                  placeholder="Ej: 5000"
                  value={data.claim_amount || ''}
                  onChange={(e) => handleUpdate({ claim_amount: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Fecha de la deuda / factura</label>
                <input 
                  type="date" 
                  className="w-full p-4 border border-slate-200 rounded-xl"
                  value={data.invoice_date || ''}
                  onChange={(e) => handleUpdate({ invoice_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Fecha último contacto con deudor</label>
                <input 
                  type="date" 
                  className="w-full p-4 border border-slate-200 rounded-xl"
                  value={data.last_contact_date || ''}
                  onChange={(e) => handleUpdate({ last_contact_date: e.target.value })}
                />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 italic">“Si no recuerdas exacto, aproxima. Luego se valida.”</p>
            <div className="flex gap-4 mt-8">
              <button onClick={prevStep} className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-lg font-bold">Atrás</button>
              <button disabled={!data.claim_amount || !data.invoice_date || !data.last_contact_date} onClick={nextStep} className="flex-[2] py-4 bg-slate-900 text-white rounded-lg font-bold disabled:opacity-50">Siguiente</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-in fade-in">
            <h2 className="text-2xl font-serif text-slate-900 mb-6">¿Qué pruebas tienes?</h2>
            <div className="space-y-3">
              {[
                { id: 'factura', label: 'Factura emitida' },
                { id: 'contrato', label: 'Contrato/presupuesto aceptado' },
                { id: 'albaran', label: 'Albarán/entrega/parte firmado' },
                { id: 'reconocimiento', label: 'Emails/WhatsApp con reconocimiento' },
                { id: 'pagos', label: 'Transferencias/pagos parciales' },
                { id: 'testigos', label: 'Testigos / otro soporte' }
              ].map(opt => (
                <label key={opt.id} className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${data.evidence?.includes(opt.id) ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input 
                    type="checkbox" 
                    checked={data.evidence?.includes(opt.id)} 
                    onChange={() => handleEvidenceToggle(opt.id)}
                    className="w-5 h-5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 mr-4"
                  />
                  <span className="font-medium text-slate-800">{opt.label}</span>
                </label>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500 font-medium">Nota: “Sin prueba, reclamar es hablar al viento.”</p>
            <div className="flex gap-4 mt-8">
              <button onClick={prevStep} className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-lg font-bold">Atrás</button>
              <button onClick={nextStep} className="flex-[2] py-4 bg-slate-900 text-white rounded-lg font-bold">Siguiente</button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="animate-in fade-in">
            <h2 className="text-2xl font-serif text-slate-900 mb-6">¿A quién reclamas?</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de deudor</label>
                <div className="flex gap-2">
                  {['Empresa', 'Particular'].map(t => (
                    <button 
                      key={t}
                      type="button"
                      onClick={() => handleUpdate({ debtor_type: t.toLowerCase() as any })}
                      className={`flex-1 py-3 px-4 border rounded-xl font-medium transition ${data.debtor_type === t.toLowerCase() ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">¿Tienes sus datos identificativos?</label>
                <select 
                  className="w-full p-4 border border-slate-200 rounded-xl"
                  onChange={(e) => handleUpdate({ debtor_identified: e.target.value as any })}
                  value={data.debtor_identified || ''}
                >
                  <option value="" disabled>Selecciona...</option>
                  <option value="si">Sí, datos completos (CIF/NIF, dirección)</option>
                  <option value="parcial">Datos parciales</option>
                  <option value="no">No tengo casi nada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">¿Dónde reside / está la sede?</label>
                <select 
                  className="w-full p-4 border border-slate-200 rounded-xl"
                  onChange={(e) => handleUpdate({ debtor_location: e.target.value as any })}
                  value={data.debtor_location || ''}
                >
                  <option value="" disabled>Selecciona...</option>
                  <option value="mismo">Mismo municipio / provincia</option>
                  <option value="otro">Otra provincia</option>
                  <option value="nsnc">No lo sé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">¿Crees que es solvente?</label>
                <select 
                  className="w-full p-4 border border-slate-200 rounded-xl"
                  onChange={(e) => handleUpdate({ debtor_solvent_hint: e.target.value as any })}
                  value={data.debtor_solvent_hint || ''}
                >
                  <option value="" disabled>Selecciona...</option>
                  <option value="solvente">Parece solvente</option>
                  <option value="nsnc">No lo sé</option>
                  <option value="no">Creo que no es solvente</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={prevStep} className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-lg font-bold">Atrás</button>
              <button disabled={!data.debtor_type || !data.debtor_identified || !data.debtor_location || !data.debtor_solvent_hint} onClick={nextStep} className="flex-[2] py-4 bg-slate-900 text-white rounded-lg font-bold disabled:opacity-50">Siguiente</button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="animate-in fade-in">
            <h2 className="text-2xl font-serif text-slate-900 mb-6">¿Qué has hecho ya?</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Acciones previas</label>
                <div className="space-y-2">
                  {[
                    { val: 'nada', label: 'Nada serio, solo mensajes' },
                    { val: 'email', label: 'Email formal reclamando' },
                    { val: 'burofax', label: 'Burofax / requerimiento fehaciente' },
                    { val: 'abogado', label: 'Ya hay negociación / abogado' }
                  ].map(opt => (
                    <label key={opt.val} className={`block p-4 border rounded-xl cursor-pointer transition ${data.prior_actions === opt.val ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200'}`}>
                      <input type="radio" name="prior" className="hidden" onChange={() => handleUpdate({ prior_actions: opt.val as any })} />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tu prioridad principal</label>
                <div className="flex flex-col gap-2">
                  {[
                    { val: 'rapido', label: 'Cobrar rápido' },
                    { val: 'tarde', label: 'Cobrar aunque tarde' },
                    { val: 'no_juicio', label: 'Evitar juicio si se puede' }
                  ].map(opt => (
                    <label key={opt.val} className={`block p-4 border rounded-xl cursor-pointer transition ${data.wants_fastest_route === opt.val ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200'}`}>
                      <input type="radio" name="route" className="hidden" onChange={() => handleUpdate({ wants_fastest_route: opt.val as any })} />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={prevStep} className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-lg font-bold">Atrás</button>
              <button disabled={!data.prior_actions || !data.wants_fastest_route} onClick={nextStep} className="flex-[2] py-4 bg-slate-900 text-white rounded-lg font-bold disabled:opacity-50">Siguiente</button>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="animate-in fade-in">
            <h2 className="text-2xl font-serif text-slate-900 mb-4">Te envío el resultado + checklist</h2>
            <p className="text-slate-600 mb-8">Y si sale viable, te propongo el siguiente paso para recuperar el dinero.</p>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Nombre completo" 
                className="w-full p-4 border border-slate-200 rounded-xl"
                value={data.full_name || ''}
                onChange={(e) => handleUpdate({ full_name: e.target.value })}
              />
              <input 
                type="email" 
                placeholder="Email de contacto" 
                className="w-full p-4 border border-slate-200 rounded-xl"
                value={data.email || ''}
                onChange={(e) => handleUpdate({ email: e.target.value })}
              />
              <input 
                type="tel" 
                placeholder="Teléfono móvil" 
                className="w-full p-4 border border-slate-200 rounded-xl"
                value={data.phone || ''}
                onChange={(e) => handleUpdate({ phone: e.target.value })}
              />
              <input 
                type="text" 
                placeholder="Empresa (opcional)" 
                className="w-full p-4 border border-slate-200 rounded-xl"
                value={data.company || ''}
                onChange={(e) => handleUpdate({ company: e.target.value })}
              />
              
              <div className="pt-4 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1" checked={data.consent_privacy} onChange={(e) => handleUpdate({ consent_privacy: e.target.checked })} />
                  <span className="text-[10px] text-slate-500 leading-tight">He leído y acepto la política de privacidad y el tratamiento de mis datos para el pre-diagnóstico.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1" checked={data.consent_contact} onChange={(e) => handleUpdate({ consent_contact: e.target.checked })} />
                  <span className="text-[10px] text-slate-500 leading-tight">Acepto ser contactado por un abogado para la revisión de este caso específico.</span>
                </label>
              </div>

              {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

              <div className="flex gap-4 mt-8">
                <button onClick={prevStep} className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-lg font-bold">Atrás</button>
                <button 
                  disabled={isSubmitting || !data.full_name || !data.email || !data.phone || !data.consent_privacy || !data.consent_contact} 
                  onClick={handleSubmit} 
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-100 disabled:opacity-50"
                >
                  {isSubmitting ? "Procesando..." : "Ver mi Radar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 9 && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse text-center">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-8"></div>
            <h2 className="text-2xl font-serif text-slate-900 mb-4">Analizando tu caso...</h2>
            <div className="space-y-2 text-sm text-slate-500 font-medium">
              <p>✓ Evaluando documentación</p>
              <p>✓ Estimando viabilidad</p>
              <p>✓ Generando checklist</p>
            </div>
            <p className="mt-8 text-xs text-slate-400">Esto tarda unos segundos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wizard;
