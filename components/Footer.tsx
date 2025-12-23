
import React from 'react';
import { APP_CONFIG } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 bg-slate-50 border-t mt-auto">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-slate-900 mb-4">{APP_CONFIG.firmName}</h3>
            <p className="text-slate-600 text-sm mb-4">
              Ayudamos a empresas y particulares a recuperar lo que es suyo mediante un enfoque legal técnico y efectivo.
            </p>
          </div>
          <div className="text-sm text-slate-600 space-y-2">
            <p><strong>Ubicación:</strong> {APP_CONFIG.city}</p>
            <p><strong>Contacto:</strong> {APP_CONFIG.adminEmail}</p>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200">
          <p className="text-[10px] md:text-xs text-slate-400 text-center leading-relaxed">
            AVISO LEGAL: El Radar de Reclamación es una herramienta de orientación inicial basada en los datos facilitados por el usuario. 
            No constituye asesoramiento legal vinculante ni establece una relación abogado-cliente. 
            Consulte siempre con un profesional colegiado antes de iniciar cualquier acción legal.
          </p>
          <div className="mt-4 flex justify-center gap-4 text-[10px] text-slate-400 uppercase tracking-widest">
            <a href="#/privacy" className="hover:text-slate-900">Privacidad</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-900">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
