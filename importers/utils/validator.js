export function validateData(data) {

    if (!data) return false;

    if (Array.isArray(data) && data.length === 0)
        return false;

    return true;

}