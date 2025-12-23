
import React from 'react';
import { APP_CONFIG } from '../constants';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-serif text-slate-900 mb-8">Política de Privacidad</h1>
      <div className="prose prose-slate prose-sm text-slate-600 leading-relaxed space-y-4">
        <p>En {APP_CONFIG.firmName}, nos tomamos muy en serio la protección de sus datos personales. De conformidad con el RGPD, le informamos:</p>
        
        <h2 className="text-lg font-bold text-slate-800 pt-4">1. Responsable del Tratamiento</h2>
        <p>Los datos recogidos a través de esta herramienta son gestionados por el equipo legal de {APP_CONFIG.firmName}, con sede en {APP_CONFIG.city}.</p>

        <h2 className="text-lg font-bold text-slate-800 pt-4">2. Finalidad del Tratamiento</h2>
        <p>Tratamos sus datos exclusivamente para:</p>
        <ul className="list-disc pl-5">
          <li>Generar el informe de pre-diagnóstico de viabilidad de su reclamación.</li>
          <li>Contactar con usted si ha solicitado expresamente una revisión por parte de un abogado.</li>
          <li>Fines estadísticos anónimos para mejorar nuestra herramienta.</li>
        </ul>

        <h2 className="text-lg font-bold text-slate-800 pt-4">3. Conservación</h2>
        <p>Los datos se conservarán durante el tiempo estrictamente necesario para la prestación del servicio solicitado y, en todo caso, durante los plazos legales de prescripción de responsabilidades.</p>

        <h2 className="text-lg font-bold text-slate-800 pt-4">4. Sus Derechos</h2>
        <p>Usted puede ejercer sus derechos de acceso, rectificación, supresión y portabilidad enviando un correo a {APP_CONFIG.adminEmail}.</p>
      </div>
      <div className="mt-12">
        <a href="/" className="text-indigo-600 font-bold text-sm">← Volver al inicio</a>
      </div>
    </div>
  );
};

export default Privacy;
