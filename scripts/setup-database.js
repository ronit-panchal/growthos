#!/usr/bin/env node

/**
 * Database Setup Script
 * Run this to check and fix database issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 GrowthOS Database Setup\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  console.log('   Please create .env.local with your DATABASE_URL');
  process.exit(1);
}

// Check if DATABASE_URL is set
const envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('DATABASE_URL=') || envContent.includes('DATABASE_URL=\n') || envContent.includes('DATABASE_URL=\r')) {
  console.error('❌ DATABASE_URL not set in .env.local');
  console.log('   Please add your Supabase database URL to .env.local');
  process.exit(1);
}

console.log('✅ Environment file found\n');

// Check if Prisma is generated
const prismaClientPath = path.join(__dirname, '..', 'node_modules', '.prisma', 'client', 'index.js');
if (!fs.existsSync(prismaClientPath)) {
  console.log('⚠️  Prisma client not generated');
  console.log('   Running: npx prisma generate\n');
  try {
    execSync('npx prisma generate', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  } catch (e) {
    console.error('❌ Failed to generate Prisma client');
    process.exit(1);
  }
}

console.log('✅ Prisma client ready\n');

// Run migration
console.log('🔄 Running database migration...\n');
try {
  execSync('npx prisma migrate dev --name add_todos_notes', { 
    stdio: 'inherit', 
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, NODE_ENV: 'development' }
  });
  console.log('\n✅ Database migration completed!');
} catch (e) {
  console.error('\n❌ Migration failed');
  console.log('   If you see "P3005" error, the database is already in sync.');
  console.log('   If you see connection errors, check your DATABASE_URL.');
  process.exit(1);
}

console.log('\n🎉 Database setup complete!');
console.log('   You can now use Notes and Tasks features.');
