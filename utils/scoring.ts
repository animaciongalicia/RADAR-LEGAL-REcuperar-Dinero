
import { LeadData, ScoringResult } from '../types';

export const calculateScore = (data: LeadData): ScoringResult => {
  let score = 0;

  // 1. Evidence Score (Max 40)
  let evidenceScore = 0;
  if (data.evidence.includes('factura')) evidenceScore += 10;
  if (data.evidence.includes('contrato')) evidenceScore += 10;
  if (data.evidence.includes('albaran')) evidenceScore += 10;
  if (data.evidence.includes('reconocimiento')) evidenceScore += 8;
  if (data.evidence.includes('pagos')) evidenceScore += 2;
  score += Math.min(evidenceScore, 40);

  // 2. Plazos Score (Max 20)
  const invoiceDate = new Date(data.invoice_date);
  const now = new Date();
  const diffMonths = (now.getFullYear() - invoiceDate.getFullYear()) * 12 + (now.getMonth() - invoiceDate.getMonth());
  
  if (diffMonths <= 6) score += 20;
  else if (diffMonths <= 18) score += 15;
  else if (diffMonths <= 36) score += 10;
  else score += 5;

  // 3. Deudor Score (Max 20)
  let deudorScore = 0;
  if (data.debtor_identified === 'si') deudorScore += 10;
  else if (data.debtor_identified === 'parcial') deudorScore += 5;

  if (data.debtor_location === 'mismo') deudorScore += 5;
  else if (data.debtor_location === 'otro') deudorScore += 3;

  if (data.debtor_solvent_hint === 'solvente') deudorScore += 5;
  else if (data.debtor_solvent_hint === 'nsnc') deudorScore += 2;
  score += Math.min(deudorScore, 20);

  // 4. Acción Score (Max 20)
  if (data.prior_actions === 'nada') score += 5;
  else if (data.prior_actions === 'email') score += 10;
  else if (data.prior_actions === 'burofax') score += 15;
  else if (data.prior_actions === 'abogado') score += 12;

  const finalScore = Math.min(score, 100);

  let color: 'green' | 'amber' | 'red';
  let pLow = 0.1, pHigh = 0.4;

  if (finalScore >= 70) {
    color = 'green';
    pLow = 0.70; pHigh = 0.90;
  } else if (finalScore >= 45) {
    color = 'amber';
    pLow = 0.45; pHigh = 0.70;
  } else {
    color = 'red';
    pLow = 0.15; pHigh = 0.45;
  }

  const recommendations: string[] = [];
  const missingEvidence: string[] = [];

  // Roadmap persuasivo
  if (color === 'green') {
    recommendations.push("AUDITORÍA DE PRUEBAS: Consolidación de documentos para blindar la reclamación.");
    recommendations.push("REQUERIMIENTO NOTARIAL/FEHACIENTE: Interrupción de prescripción y última oportunidad de pago amistoso.");
    recommendations.push("BLOQUEO DE ACTIVOS: Si persiste el impago, solicitar medidas preventivas sobre el patrimonio del deudor.");
    recommendations.push("DEMANDA MONITORIA: Activación de la vía judicial rápida para obtener un título ejecutivo.");
  } else if (color === 'amber') {
    recommendations.push("COMPLEMENTACIÓN DOCUMENTAL: Es vital localizar el albarán o email de aceptación que falta.");
    recommendations.push("INVESTIGACIÓN PATRIMONIAL: Análisis preventivo en el Registro de la Propiedad y Mercantil.");
    recommendations.push("ESTRATEGIA DE NEGOCIACIÓN: Propuesta de calendario de pagos fraccionados con reconocimiento de deuda.");
    recommendations.push("REQUERIMIENTO CON ADVERTENCIA JUDICIAL: Enviar Burofax redactado por letrado para generar presión real.");
  } else {
    recommendations.push("REVISIÓN DE CADUCIDAD: Confirmar que el derecho a reclamar no haya prescrito legalmente.");
    recommendations.push("NEGOCIACIÓN EXTRAJUDICIAL AGRESIVA: Intentar acuerdo de quita o espera para recuperar al menos el principal.");
    recommendations.push("VALORACIÓN COSTES/BENEFICIO: Análisis de viabilidad económica antes de incurrir en tasas judiciales.");
    recommendations.push("LOCALIZACIÓN DE DEUDOR: Servicios de averiguación de domicilio y solvencia actual.");
  }

  return {
    score: finalScore,
    color,
    minRecoverable: Math.round(data.claim_amount * pLow),
    maxRecoverable: Math.round(data.claim_amount * pHigh),
    recommendations,
    missingEvidence
  };
};
