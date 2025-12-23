
import { z } from 'zod';

export const LeadSchema = z.object({
  case_type: z.enum(['factura', 'particular', 'anticipo', 'otro']),
  case_type_other: z.string().optional(),
  claim_amount: z.number().min(1, "El importe debe ser mayor a 0"),
  invoice_date: z.string().min(1, "Fecha de factura requerida"),
  last_contact_date: z.string().min(1, "Fecha de último contacto requerida"),
  evidence: z.array(z.string()),
  debtor_type: z.enum(['empresa', 'particular']),
  debtor_identified: z.enum(['si', 'parcial', 'no']),
  debtor_location: z.enum(['mismo', 'otro', 'nsnc']),
  debtor_solvent_hint: z.enum(['solvente', 'nsnc', 'no']),
  prior_actions: z.enum(['nada', 'email', 'burofax', 'abogado']),
  wants_fastest_route: z.enum(['rapido', 'tarde', 'no_juicio']),
  full_name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Teléfono inválido"),
  company: z.string().optional(),
  consent_privacy: z.boolean().refine(v => v === true, "Debes aceptar la política"),
  consent_contact: z.boolean().refine(v => v === true, "Debes aceptar el contacto")
});

export type LeadData = z.infer<typeof LeadSchema>;

export interface ScoringResult {
  score: number;
  color: 'green' | 'amber' | 'red';
  minRecoverable: number;
  maxRecoverable: number;
  recommendations: string[];
  missingEvidence: string[];
}

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}
