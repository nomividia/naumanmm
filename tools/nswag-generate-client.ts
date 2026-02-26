import * as colors from "colors/safe";
import * as fs from "fs";
import { NodeHelpers } from "nextalys-node-helpers";
import * as path from "path";

const apiSwaggerUrl = "http://localhost:3037/api/docs/swagger.json";

const swaggerCodegenConfig = path.join(
    __dirname,
    "swagger-codegen-config.json"
);

const swaggerFrontOutput = path.join(
    __dirname,
    "..",
    "front",
    "src",
    "providers",
    "api-client.generated"
);

if (!fs.existsSync(swaggerCodegenConfig)) {
    console.error(
        colors.red(
            `Impossible de générer le code client : le fichier de configuration ${swaggerCodegenConfig} n'existe pas !`
        )
    );
    process.exit(1);
}

NodeHelpers.executeCommand(
    `npx openapi-generator-cli generate -i "${apiSwaggerUrl}" -g typescript-angular -c "${swaggerCodegenConfig}" -o "${swaggerFrontOutput}" --type-mappings DateTime=Date`,
    { cwd: path.resolve(path.join(__dirname, "..")) }
)
    .then(() => {
        console.log(colors.green(`Code client généré avec succès !`));
    })
    .catch((err: string) => {
        console.error(
            colors.red(`Impossible de générer le code client : ${err}`)
        );
    });
