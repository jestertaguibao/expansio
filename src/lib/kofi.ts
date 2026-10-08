/**
 * Ko-fi donation integration config.
 * Single source of truth for the checkout URL so the frontend button and any
 * future components never drift.
 */
export const KOFI_SUPPORT_URL =
  'https://ko-fi.com/summary/b2e66435-2de1-499c-9404-ac748af069a2';

/**
 * Note shown next to every Ko-fi CTA — the webhook matches donors by email,
 * so this instruction is functionally required, not just polite copy.
 */
export const KOFI_EMAIL_NOTE =
  'Please use the same email address registered to your account so we can automatically unlock your features.';
