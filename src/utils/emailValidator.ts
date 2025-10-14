
/**
 * Sanitizes email input string.
 *

 * @param email The raw email input string.
 * @returns A cleaned and normalized email string.
 *
 */
export function sanitizeEmail(raw: string): string {
  // Trim leading and trailing spaces and normalize case
  let email = raw.trim().toLowerCase();

  // Remove any characters that don't belong in a standard email
  // Allowed characters: letters, digits, '.', '_', '-', '+', and '@'
  email = email.replace(/[^a-z0-9@._+\- ]/gi, "");

  return email;
}


/**
 * Validate email format manually using regex and logic checks.
 * @param email The email string to validate.
 * @returns True if the email is valid, false otherwise.
 *
 */
export function isValidEmail(email: string): boolean {
    if (!email) return false;
    if(email.length > 320) return false;

    // Trim whitespace
    email = email.trim();

    // Basic structure check: single @ separating local and domain
    const parts = email.split("@");
    if (parts.length !== 2) return false;

    const [local, domain] = parts;

    // Local part: no consecutive dots, no spaces, ASCII only
    if (!local || local.includes(" ") || local.includes("..") || /[^\x00-\x7F]/.test(local)) {
        return false;
    }

    // Domain part: valid characters, no leading/trailing dot, no spaces
    if (
        !domain ||
        domain.startsWith(".") ||
        domain.endsWith(".") ||
        domain.includes(" ") ||
        /[^a-zA-Z0-9.-]/.test(domain) ||
        domain.includes("_")||
        /[^\u0000-\u007F]/.test(domain)
    ) {
        return false;
    }

    // TLD: at least 2 letters, only letters
    const domainParts = domain.split(".");
    if (domainParts.length < 2) return false;
    const tld = domainParts[domainParts.length - 1];
    if (!/^[a-zA-Z]{2,}$/.test(tld)) return false;

    return true;
}

