export function log(message) {

    const time = new Date().toLocaleString();

    console.log(`[${time}] ${message}`);

}