
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { LeadData, ScoringResult } from '../types';
import { CHECKLIST_ITEMS, APP_CONFIG } from '../constants';

export const generateRadarPDF = async (data: LeadData, results: ScoringResult) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 Size
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Logo Placeholder / Brand Name
  page.drawText(APP_CONFIG.firmName.toUpperCase(), {
    x: 50,
    y: height - 50,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.4),
  });

  page.drawText('DICTAMEN TÉCNICO DE VIABILIDAD JURÍDICA', {
    x: 50,
    y: height - 70,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Client Box
  page.drawRectangle({
    x: 50, y: height - 160, width: 495, height: 70,
    color: rgb(0.95, 0.96, 0.98),
  });

  page.drawText('DATOS DEL EXPEDIENTE', { x: 60, y: height - 105, size: 8, font: boldFont, color: rgb(0.3, 0.3, 0.3) });
  page.drawText(`CLIENTE: ${data.full_name}`, { x: 60, y: height - 120, size: 10, font });
  page.drawText(`DEUDA PRINCIPAL: ${data.claim_amount.toLocaleString('es-ES')} €`, { x: 60, y: height - 135, size: 10, font: boldFont });
  page.drawText(`FECHA DE EMISIÓN: ${new Date().toLocaleDateString('es-ES')}`, { x: 60, y: height - 150, size: 9, font });

  // Status Bar
  const colorMap = {
    green: rgb(0.05, 0.45, 0.25),
    amber: rgb(0.7, 0.4, 0),
    red: rgb(0.7, 0.1, 0.1)
  };

  page.drawRectangle({
    x: 50, y: height - 230, width: 495, height: 50,
    color: colorMap[results.color],
    opacity: 0.1
  });

  page.drawText(`VIABILIDAD ESTIMADA: ${results.color === 'green' ? 'ALTA' : results.color === 'amber' ? 'MEDIA' : 'COMPLEJA'}`, {
    x: 65, y: height - 205, size: 14, font: boldFont, color: colorMap[results.color]
  });

  page.drawText(`SCORE JURÍDICO: ${results.score} / 100`, {
    x: 65, y: height - 220, size: 10, font, color: colorMap[results.color]
  });

  // Projection
  page.drawText('PROYECCIÓN DE RECUPERACIÓN (ESTIMADA)', { x: 50, y: height - 260, size: 9, font: boldFont, color: rgb(0.4, 0.4, 0.4) });
  page.drawText(`${results.minRecoverable} € - ${results.maxRecoverable} €`, { x: 50, y: height - 280, size: 18, font: boldFont });

  // Strategy Roadmap
  page.drawText('HOJA DE RUTA ESTRATÉGICA', { x: 50, y: height - 330, size: 12, font: boldFont });
  let currentY = height - 355;
  results.recommendations.forEach((rec, i) => {
    const [title, desc] = rec.split(':');
    page.drawText(`${i + 1}. ${title}`, { x: 50, y: currentY, size: 10, font: boldFont });
    page.drawText(desc.trim(), { x: 65, y: currentY - 15, size: 9, font, color: rgb(0.3, 0.3, 0.3) });
    currentY -= 40;
  });

  // Documentation Checklist
  page.drawText('AUDITORÍA DOCUMENTAL RECOMENDADA', { x: 50, y: currentY - 20, size: 12, font: boldFont });
  currentY -= 45;
  CHECKLIST_ITEMS.slice(0, 7).forEach((item, i) => {
    page.drawText(`[ ] ${item}`, { x: 55, y: currentY, size: 9, font });
    currentY -= 18;
  });

  // Professional Footer
  page.drawRectangle({ x: 50, y: 50, width: 495, height: 1, color: rgb(0.8, 0.8, 0.8) });
  page.drawText(`${APP_CONFIG.firmName} - Consultoría Legal Especializada`, { x: 50, y: 35, size: 8, font: boldFont, color: rgb(0.5, 0.5, 0.5) });
  page.drawText('Este documento es un análisis automatizado sujeto a revisión por un letrado colegiado.', { x: 50, y: 25, size: 7, font, color: rgb(0.6, 0.6, 0.6) });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
