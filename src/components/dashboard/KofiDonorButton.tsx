'use client';

import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';
// Reminder: KOFI_SUPPORT_URL lives in @/lib/kofi (single source of truth). After
// the $2 price pivot, swap it THERE for a real $2-specific Ko-fi Membership Tier /
// Shop Item link — see the TODO(dev) in src/lib/kofi.ts — so checkout reflects $2.
import { KOFI_SUPPORT_URL, KOFI_EMAIL_NOTE, KOFI_DONATION_AMOUNT_USD } from '@/lib/kofi';

interface KofiDonorButtonProps {
  /** Extra classes for the <a> element (e.g. sizing/color in different shells) */
  buttonClassName?: string;
  /** Extra classes for the note text (theme-aware where it's mounted) */
  noteClassName?: string;
  /** Hide the small email-matching note under the button */
  hideNote?: boolean;
  label?: string;
}

/**
 * "Become a Donor" CTA — opens the Ko-fi checkout in a new tab.
 * The tier upgrade happens server-side via the Ko-fi webhook
 * (/api/webhooks/kofi) matching the payer's email, which is why the
 * email-matching note below the button is part of the contract.
 */
export default function KofiDonorButton({
  buttonClassName = 'btn-primary',
  noteClassName = 'text-base-content/60',
  hideNote = false,
  label = `Become a Donor · $${KOFI_DONATION_AMOUNT_USD}`,
}: KofiDonorButtonProps) {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* DaisyUI tooltip wrapper */}
      <div
        className="tooltip tooltip-top w-auto"
        data-tip={`Support with a $${KOFI_DONATION_AMOUNT_USD} donation · use your registered email`}
      >
        <a
          href={KOFI_SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn gap-2 ${buttonClassName}`}
        >
          <Heart className="w-4 h-4 fill-current" />
          <span>{label}</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>
      </div>

      {!hideNote && (
        <p className={`text-[11px] leading-snug text-center max-w-xs ${noteClassName}`}>
          <Heart className="w-3 h-3 inline-block mr-1 fill-current opacity-60" />
          {KOFI_EMAIL_NOTE}
        </p>
      )}
    </div>
  );
}
