/**
 * Name validation
 *
 * - Number of characters must be beteween 1 to 80
 * @param value Value to validate
 * @return Is valid
 */
export const nameValidation = (value: string) => {
    const name = value.trim();
    if(name.length < 1 || name.length > 80 ) return false;
    return true;
}

/**
 * Biography validation
 *
 * - Mininum length 1 character
 * @param value Value to validate
 * @return Is valid
 */
export const bioValidation = (value: string)=>{
    const bio = value.trim();
    if(!bio) return;
    if(bio.length < 1) return false;
    return true;
}
