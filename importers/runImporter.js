import { IMPORTER_CONFIG } from "./importerConfig.js";
import { log } from "./utils/logger.js";
import { downloadSource } from "./utils/download.js";
import { validateData } from "./utils/validator.js";

async function runImporter() {

    log("====================================");
    log(" Sarkar Smart AI Importer Started ");
    log("====================================");

    for (const key in IMPORTER_CONFIG) {

        const source = IMPORTER_CONFIG[key];

        if (!source.enabled) continue;

        log(`Importing ${source.name}...`);

        const result = await downloadSource(source.name);

        if (!validateData(result)) {

            log(`${source.name} failed validation.`);
            continue;

        }

        log(`${source.name} imported successfully.`);
    }

    log("------------------------------------");
    log("All Importers Completed Successfully");
    log("------------------------------------");

}

runImporter();