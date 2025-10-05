#!/usr/bin/env node

/**
 * Prisma Schema Merger
 * 
 * This script merges multiple .prisma files into a single schema.prisma file
 * Usage: node merge-schemas.js
 */

const fs = require('fs');
const path = require('path');

const SCHEMA_DIR = './prisma';
const OUTPUT_FILE = path.join(SCHEMA_DIR, 'schema.prisma');

// Order matters - base config first, then dependencies
const SCHEMA_FILES = [
  'base.prisma',     // Generator and datasource
  'core.prisma',     // Core models (User, Tenant, etc.)
  'rbac.prisma',     // RBAC models
  'security.prisma', // Security resources
  'audit.prisma',    // Audit and system models
];

function mergeSchemas() {
  console.log('🔧 Merging Prisma schemas...');
  
  let mergedContent = '';
  let hasGenerator = false;
  let hasDatasource = false;
  
  SCHEMA_FILES.forEach(fileName => {
    const filePath = path.join(SCHEMA_DIR, fileName);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Warning: ${fileName} not found, skipping...`);
      return;
    }
    
    console.log(`📄 Processing ${fileName}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove comments that are just separators
    content = content.replace(/\/\/ ={30,}/g, '');
    
    // Handle generator and datasource - only include once
    if (fileName === 'base.prisma') {
      // Keep the entire base file (generator + datasource)
      mergedContent += content + '\n\n';
      hasGenerator = true;
      hasDatasource = true;
    } else {
      // Remove generator and datasource from other files
      content = content.replace(/generator\s+\w+\s*{[^}]*}/g, '');
      content = content.replace(/datasource\s+\w+\s*{[^}]*}/g, '');
      
      // Remove extra newlines
      content = content.replace(/\n{3,}/g, '\n\n');
      content = content.trim();
      
      if (content) {
        mergedContent += `// ================================\n`;
        mergedContent += `// FROM: ${fileName.toUpperCase()}\n`;
        mergedContent += `// ================================\n\n`;
        mergedContent += content + '\n\n';
      }
    }
  });
  
  // Validate we have required sections
  if (!hasGenerator) {
    console.error('❌ Error: No generator found in base.prisma');
    process.exit(1);
  }
  
  if (!hasDatasource) {
    console.error('❌ Error: No datasource found in base.prisma');
    process.exit(1);
  }
  
  // Write merged schema
  fs.writeFileSync(OUTPUT_FILE, mergedContent);
  
  console.log(`✅ Successfully merged schemas into ${OUTPUT_FILE}`);
  console.log(`📊 Total files processed: ${SCHEMA_FILES.length}`);
  
  // Show file sizes
  const stats = fs.statSync(OUTPUT_FILE);
  console.log(`📦 Generated schema size: ${(stats.size / 1024).toFixed(1)} KB`);
}

function validateSchema() {
  console.log('\n🔍 Validating merged schema...');
  
  const { execSync } = require('child_process');
  
  try {
    // Run Prisma format to validate syntax
    execSync('npx prisma format', { stdio: 'pipe' });
    console.log('✅ Schema syntax is valid');
    
    // Run Prisma validate
    execSync('npx prisma validate', { stdio: 'pipe' });
    console.log('✅ Schema validation passed');
    
  } catch (error) {
    console.error('❌ Schema validation failed:');
    console.error(error.stdout?.toString() || error.message);
    process.exit(1);
  }
}

function main() {
  console.log('🚀 BlickTrack Prisma Schema Merger\n');
  
  try {
    mergeSchemas();
    validateSchema();
    
    console.log(`
✨ Schema merge completed successfully!

Next steps:
1. Review the generated schema.prisma file
2. Run: npx prisma generate
3. Run: npx prisma db push (for development)
   OR: npx prisma migrate dev --name "rbac-implementation" (for production)

Schema files used:
${SCHEMA_FILES.map(f => `  - ${f}`).join('\n')}
    `);
    
  } catch (error) {
    console.error('❌ Error during schema merge:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { mergeSchemas, validateSchema };