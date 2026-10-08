/**
 * Ko-fi donation integration config.
 * Single source of truth for the checkout URL so the frontend button and any
 * future components never drift.
 */
/** Suggested one-off donation (USD). Used to prefill the Ko-fi checkout amount. */
export const KOFI_DONATION_AMOUNT_USD = 2;

/**
 * Ko-fi checkout URL — single source of truth (used by <KofiDonorButton />).
 *
 * TODO(dev) — $2 PRICE PIVOT: REPLACE THIS LINK BEFORE LAUNCH.
 * The `?amount=2` below only PREFILLS the donation box; it does NOT create a
 * real $2 product. To make checkout actually charge $2:
 *   1. Log into your Ko-fi account.
 *   2. Create a new "Membership Tier" (recurring) or a specific Shop Item priced
 *      at $2.
 *   3. Copy that tier/item's unique summary link.
 *   4. Swap the URL string below for the new $2-specific link.
 * Until this is done, treat the current URL as a placeholder.
 */
export const KOFI_SUPPORT_URL =
  'https://ko-fi.com/summary/b2e66435-2de1-499c-9404-ac748af069a2?amount=' +
  KOFI_DONATION_AMOUNT_USD;

/**
 * Note shown next to every Ko-fi CTA — the webhook matches donors by email,
 * so this instruction is functionally required, not just polite copy.
 */
export const KOFI_EMAIL_NOTE =
  'Please use the same email address registered to your account so we can automatically unlock your features.';
