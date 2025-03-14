import fs from 'fs';
import path from 'path';

const prismaFolder = __dirname;
const schemaPath = path.join(__dirname, 'schema.prisma');

// Load the base Prisma schema file (if you have a generator/config file)
let mergedSchema = `
generator client {
  provider = "prisma-client-js"
}

generator zod {
    provider                  = "zod-prisma-types"
    createRelationValuesTypes = true
    writeNullishInModelTypes  = true
}

datasource db {
  provider = "postgresql"
  url      = env("ConnectionString")
}
`;

// Read all `.prisma` model files
const modelFiles = fs.readdirSync(prismaFolder).filter(file => file.endsWith('.model.prisma'));

modelFiles.forEach(file => {
  const content = fs.readFileSync(path.join(prismaFolder, file), 'utf-8');
  mergedSchema += `\n${content}`;
});

// Write the merged schema to schema.prisma
fs.writeFileSync(schemaPath, mergedSchema);

console.log('Prisma schema merged successfully!');
