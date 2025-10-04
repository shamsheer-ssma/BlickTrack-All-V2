# Quick Test Files

This folder is for temporary testing and debugging scripts.

## Usage

Place any temporary .js files here for testing:
- Authentication tests
- Database verification scripts  
- API testing scripts
- Debug utilities

## Common Test Scripts

### Database User Check
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: { email: true, firstName: true, userType: true, isActive: true }
  });
  console.log('Users:', users);
  await prisma.$disconnect();
}

checkUsers();
```

### Password Test
```javascript
const bcrypt = require('bcryptjs');
// Test if password 'Syed@123' matches stored hash
const isValid = await bcrypt.compare('Syed@123', storedHash);
console.log('Password valid:', isValid);
```

## Clean Up

Run from backend directory:
```bash
# Move test files to quick-test folder
mv *test*.js quick-test/
mv *debug*.js quick-test/
mv *temp*.js quick-test/
```

## Note

Files in this folder should be temporary and can be deleted safely.