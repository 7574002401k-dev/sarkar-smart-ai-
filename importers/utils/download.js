export async function downloadSource(name) {

    return {

        source: name,

        status: "success",

        downloadedAt: new Date(),

        data: []

    };

}