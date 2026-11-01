/**
 * Safe clipboard copying utility with fallback for non-HTTPS or unsupported environments.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // 1. Try modern navigator.clipboard API if available
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('[LuxeData Clipboard] navigator.clipboard.writeText failed, attempting execCommand fallback:', err);
    }
  }

  // 2. Fallback to document.execCommand('copy')
  let textarea: HTMLTextAreaElement | null = null;
  try {
    textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const success = document.execCommand('copy');
    return success;
  } catch (fallbackErr) {
    console.error('[LuxeData Clipboard] All clipboard copy attempts failed:', fallbackErr);
    return false;
  } finally {
    if (textarea && document.body.contains(textarea)) {
      document.body.removeChild(textarea);
    }
  }
}
