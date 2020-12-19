/**
 * Name validation
 *
 * - Number of characters must ve beteween 1 to 80
 * @param value Value to validate
 * @return Is valid
 */
export const nameValidation = (value: string) => {
    const name = value.trim();
    if(name.length < 1 || name.length > 80 ) return false;
    return true;
}

