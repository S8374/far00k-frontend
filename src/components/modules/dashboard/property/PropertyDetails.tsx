'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Landmark, Copy, User, Shield, Lock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PropertyDetails({ bankAccounts, propertyInvisitors }: any) {
  const [copied, setCopied] = useState(false);
  
  console.log("PropertyDetails Bank Accounts:", bankAccounts);
  console.log("PropertyDetails Property Invisitors:", propertyInvisitors);

  // Get the first bank account (if any)
  const bankAccount = bankAccounts?.[0];
  
  // Get the first investor (if any)
  const investor = propertyInvisitors?.[0];

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${label} copied to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const formatIBAN = (iban: string) => {
    if (!iban) return '';
    // Format IBAN in groups of 4 characters
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <div className="space-y-3">
      {/* Seller Bank Details */}
      <Card className="bg-[#1E2126] text-white border-white/10 rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2">
            <Landmark className="text-emerald-500" size={15} />
            <CardTitle className="text-sm font-semibold">Seller Bank Details</CardTitle>
          </div>

          {bankAccount && (
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]">
              <Shield className="mr-1 h-3 w-3" />
              REGA Verified
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-3 text-sm p-4 pt-1">
          {bankAccount ? (
            <>
              <Info label="Bank Name" value={bankAccount.bankName || 'N/A'} />
              <Info label="Account Holder" value={bankAccount.accountHolder || 'N/A'} />

              {/* IBAN with Copy */}
              {bankAccount.iban && (
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-zinc-400">IBAN</p>
                    <p className="font-mono tracking-wide text-sm break-all">
                      {formatIBAN(bankAccount.iban)}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7 bg-[#0F5E34] hover:bg-[#0C4D2B] shrink-0"
                    onClick={() => handleCopy(bankAccount.iban, 'IBAN')}
                  >
                    <Copy size={14} />
                  </Button>
                </div>
              )}

              {bankAccount.swiftCode && (
                <Info label="SWIFT Code" value={bankAccount.swiftCode} />
              )}
              
              {bankAccount.branchAddress && (
                <Info label="Branch Address" value={bankAccount.branchAddress} />
              )}

              {bankAccount.additionalInfo && (
                <div className="mt-2 p-2 bg-black/20 border border-white/10 rounded-md">
                  <p className="text-xs text-zinc-400">Additional Information</p>
                  <p className="text-sm text-zinc-300">{bankAccount.additionalInfo}</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4 text-zinc-400 text-sm">
              No bank account details available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Investor Information */}
      <Card className="bg-[#1E2126] text-white border-white/10 rounded-xl">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold">Investor Information</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          {investor ? (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600/40">
                  <User size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">{investor.name}</p>
                  <p className="text-xs text-zinc-400">
                    {investor.relationship?.replace(/_/g, ' ').toLowerCase()
                      .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              {investor.email && (
                <Info label="Email" value={investor.email} />
              )}
              
              {investor.phoneNumber && (
                <Info label="Phone" value={investor.phoneNumber} />
              )}
              
              {investor.idNumber && (
                <Info label="ID Number" value={investor.idNumber} />
              )}
              
              {investor.idType && (
                <Info label="ID Type" value={investor.idType} />
              )}

              <div className="flex items-center gap-2 rounded-md bg-emerald-900/20 border border-emerald-600/30 px-3 py-2 text-emerald-400 text-xs">
                <Shield size={14} />
                <span>Verified Investor</span>
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-zinc-400 text-sm">
              No investor information available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Escrow Protection */}
      <Card className="bg-[#1E2126] text-white border-white/10 rounded-xl">
        <CardContent className="p-4 flex gap-3">
          <Shield className="text-yellow-500 mt-0.5" size={28} />
          <div>
            <p className="text-sm font-medium">Escrow Protection Coming Soon</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your payments will be secured in escrow until construction milestones are verified by
              REGA.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Digital Title Deed */}
      <Card className="bg-[#1E2126] text-white border-white/10 rounded-xl">
        <CardContent className="p-4 flex gap-3">
          <div className='bg-white/10 p-2 rounded-full'>
            <Lock className="text-zinc-400" size={20} />
          </div>
          <div>
            <p className="text-sm font-medium">Digital Title Deed</p>
            <p className="text-xs text-zinc-400">
              Title Deed will unlock at 100% payment completion
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* Helper Component */
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-zinc-400">{label}</p>
      <p className="text-sm wrap-break-word text-zinc-200">{value}</p>
    </div>
  );
}