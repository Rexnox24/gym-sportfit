import { useState } from 'react';
import { Check, Copy, Landmark, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bankAccount, receiptWhatsApp } from '@/lib/gym-data';

export interface BankTransferProps { amount?: number | undefined }

/** Datos bancarios oficiales para pagar por transferencia. */
export function BankTransfer({ amount }: BankTransferProps) {
 const text = encodeURIComponent(`Hola, envío mi comprobante de transferencia a Gym Sportfit${amount !== undefined ? ` por $${amount.toLocaleString('es-MX')} MXN` : ''}.`);
 const [copied, setCopied] = useState(false);
 async function copy() { try { await navigator.clipboard.writeText(bankAccount.number); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* sin portapapeles */ } }
 return <div className="bank-box">
  <div className="eyebrow"><Landmark aria-hidden="true" /> TRANSFERENCIA BANCARIA</div>
  <dl className="bank-data">
   <div><dt>Banco</dt><dd>{bankAccount.bank}</dd></div>
   <div><dt>Número de tarjeta</dt><dd className="bank-number">{bankAccount.formatted}</dd></div>
   <div><dt>Titular</dt><dd>{bankAccount.holder}</dd></div>
   {amount !== undefined && <div><dt>Monto</dt><dd className="text-primary">${amount.toLocaleString('es-MX')} MXN</dd></div>}
  </dl>
  <div className="flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={copy}>{copied ? <Check /> : <Copy />}{copied ? 'NÚMERO COPIADO' : 'COPIAR NÚMERO'}</Button>
  <Button asChild variant="sport"><a href={`https://wa.me/${receiptWhatsApp.number}?text=${text}`} target="_blank" rel="noreferrer"><MessageCircle />ENVIAR COMPROBANTE</a></Button></div>
  <p className="section-text">Transfiere desde tu app bancaria y manda tu comprobante por WhatsApp al {receiptWhatsApp.formatted}. Al confirmarlo activamos tu membresía.</p>
 </div>;
}
