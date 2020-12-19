/**
 * Title validation
 *
 * - Number of characters must be beteween 1 to 80
 * @param value Value to validate
 * @return Is valid
 */
export const titleValidation = (value: string) => {
    const name = value.trim();
    if (name.length < 1 || name.length > 200) return false;
    return true;
}


/**
 * Synopsis validation
 *
 * - Mininum length 1 character
 * @param value Value to validate
 * @return Is valid
 */
export const synopsisValidation = (value: string) => {
    const synopsis = value.trim();
    if (!synopsis) return;
    if (synopsis.length < 1) return false;
    return true
}

