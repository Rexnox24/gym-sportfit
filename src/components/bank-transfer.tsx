import { useState } from 'react';
import { Check, Copy, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bankAccount } from '@/lib/gym-data';

export interface BankTransferProps { amount?: number | undefined }

/** Datos bancarios oficiales para pagar por transferencia o depósito. */
export function BankTransfer({ amount }: BankTransferProps) {
 const [copied, setCopied] = useState(false);
 async function copy() { try { await navigator.clipboard.writeText(bankAccount.number); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* sin portapapeles */ } }
 return <div className="bank-box">
  <div className="eyebrow"><Landmark aria-hidden="true" /> TRANSFERENCIA O DEPÓSITO</div>
  <dl className="bank-data">
   <div><dt>Banco</dt><dd>{bankAccount.bank}</dd></div>
   <div><dt>Número de tarjeta</dt><dd className="bank-number">{bankAccount.formatted}</dd></div>
   <div><dt>Titular</dt><dd>{bankAccount.holder}</dd></div>
   {amount !== undefined && <div><dt>Monto</dt><dd className="text-primary">${amount.toLocaleString('es-MX')} MXN</dd></div>}
  </dl>
  <Button type="button" variant="outline" onClick={copy}>{copied ? <Check /> : <Copy />}{copied ? 'NÚMERO COPIADO' : 'COPIAR NÚMERO'}</Button>
  <p className="section-text">Transfiere desde tu app bancaria o deposita en OXXO o practicaja BBVA. Muestra tu comprobante en recepción y activamos tu membresía.</p>
 </div>;
}
