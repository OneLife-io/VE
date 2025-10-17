#!/usr/bin/env node

/**
 * Safe Duplicate File Cleaner
 * 
 * Scans the workspace for duplicate files and:
 * 1. Deletes truly identical duplicates (same content hash)
 * 2. Archives conflicting duplicates (same name, different content) to .archive/
 * 
 * Usage:
 *   node scripts/dedupe-files.js --dry-run   # Preview only
 *   node scripts/dedupe-files.js --apply     # Execute changes
 *   node scripts/dedupe-files.js --prefer "src,lib,app"  # Priority directories
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const IGNORE_DIRS = [
    'node_modules',
    '.git',
    '.archive',
    'dist',
    'build',
    'coverage',
    '.next',
    '.nuxt',
];

const IGNORE_FILES = [
    '.DS_Store',
    'Thumbs.db',
    '.gitkeep',
];

class DuplicateFileCleaner {
    constructor(options = {}) {
        this.rootDir = options.rootDir || path.join(__dirname, '..');
        this.dryRun = options.dryRun !== false;
        this.preferredPaths = options.preferredPaths || ['src', 'lib', 'app'];
        this.filesByHash = new Map();
        this.filesByName = new Map();
        this.stats = {
            scanned: 0,
            identicalDuplicates: 0,
            conflictingDuplicates: 0,
            deleted: 0,
            archived: 0,
        };
    }

    /**
     * Calculate MD5 hash of file content
     */
    getFileHash(filePath) {
        const content = fs.readFileSync(filePath);
        return crypto.createHash('md5').update(content).digest('hex');
    }

    /**
     * Check if path should be ignored
     */
    shouldIgnore(filePath) {
        const parts = filePath.split(path.sep);

        // Ignore specific directories
        if (parts.some(part => IGNORE_DIRS.includes(part))) {
            return true;
        }

        // Ignore specific files
        const basename = path.basename(filePath);
        if (IGNORE_FILES.includes(basename)) {
            return true;
        }

        return false;
    }

    /**
     * Recursively scan directory for files
     */
    scanDirectory(dir, files = []) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (this.shouldIgnore(fullPath)) {
                continue;
            }

            if (entry.isDirectory()) {
                this.scanDirectory(fullPath, files);
            } else if (entry.isFile()) {
                files.push(fullPath);
                this.stats.scanned++;
            }
        }

        return files;
    }

    /**
     * Index files by hash and name
     */
    indexFiles(files) {
        console.log(`\n📊 Indexing ${files.length} files...`);

        for (const filePath of files) {
            try {
                const hash = this.getFileHash(filePath);
                const basename = path.basename(filePath);
                const relativePath = path.relative(this.rootDir, filePath);

                // Index by hash (for identical content)
                if (!this.filesByHash.has(hash)) {
                    this.filesByHash.set(hash, []);
                }
                this.filesByHash.get(hash).push({ path: filePath, relativePath });

                // Index by name (for conflicting names)
                if (!this.filesByName.has(basename)) {
                    this.filesByName.set(basename, []);
                }
                this.filesByName.get(basename).push({ path: filePath, relativePath, hash });
            } catch (error) {
                console.warn(`⚠️  Could not hash ${filePath}: ${error.message}`);
            }
        }

        console.log(`✅ Indexed ${this.filesByHash.size} unique file contents`);
        console.log(`✅ Found ${this.filesByName.size} unique filenames`);
    }

    /**
     * Determine which file to keep based on path priority
     */
    selectKeeper(files) {
        // Sort by priority (preferred paths first)
        const sorted = [...files].sort((a, b) => {
            const aPriority = this.getPathPriority(a.relativePath);
            const bPriority = this.getPathPriority(b.relativePath);

            if (aPriority !== bPriority) {
                return bPriority - aPriority; // Higher priority first
            }

            // If same priority, prefer shorter paths
            return a.relativePath.length - b.relativePath.length;
        });

        return sorted[0];
    }

    /**
     * Get priority score for a path
     */
    getPathPriority(relativePath) {
        const parts = relativePath.split(path.sep);

        for (let i = 0; i < this.preferredPaths.length; i++) {
            if (parts.includes(this.preferredPaths[i])) {
                return this.preferredPaths.length - i;
            }
        }

        return 0;
    }

    /**
     * Delete a file safely
     */
    deleteFile(filePath) {
        if (this.dryRun) {
            console.log(`[DRY-RUN] Would delete: ${filePath}`);
            return;
        }

        fs.unlinkSync(filePath);
        this.stats.deleted++;
        console.log(`🗑️  Deleted: ${filePath}`);
    }

    /**
     * Archive a file to .archive/duplicates/
     */
    archiveFile(filePath, reason = 'conflict') {
        const relativePath = path.relative(this.rootDir, filePath);
        const archivePath = path.join(
            this.rootDir,
            '.archive',
            'duplicates',
            reason,
            relativePath
        );

        if (this.dryRun) {
            console.log(`[DRY-RUN] Would archive: ${filePath} → ${archivePath}`);
            return;
        }

        // Create archive directory
        const archiveDir = path.dirname(archivePath);
        fs.mkdirSync(archiveDir, { recursive: true });

        // Move file
        fs.renameSync(filePath, archivePath);
        this.stats.archived++;
        console.log(`📦 Archived: ${filePath} → ${archivePath}`);
    }

    /**
     * Process identical duplicates (same hash)
     */
    processIdenticalDuplicates() {
        console.log('\n🔍 Processing identical duplicates...');

        for (const [hash, files] of this.filesByHash.entries()) {
            if (files.length <= 1) continue;

            this.stats.identicalDuplicates += files.length - 1;

            console.log(`\n📄 Found ${files.length} identical files (hash: ${hash.substring(0, 8)}...):`);
            const keeper = this.selectKeeper(files);
            console.log(`   ✅ KEEP: ${keeper.relativePath}`);

            for (const file of files) {
                if (file.path === keeper.path) continue;
                console.log(`   ❌ DELETE: ${file.relativePath}`);
                this.deleteFile(file.path);
            }
        }
    }

    /**
     * Process conflicting duplicates (same name, different content)
     */
    processConflictingDuplicates() {
        console.log('\n🔍 Processing conflicting duplicates (same name, different content)...');

        for (const [basename, files] of this.filesByName.entries()) {
            if (files.length <= 1) continue;

            // Check if files have different hashes
            const hashes = new Set(files.map(f => f.hash));
            if (hashes.size <= 1) continue; // All identical, already handled

            this.stats.conflictingDuplicates += files.length - 1;

            console.log(`\n⚠️  Found ${files.length} conflicting files named "${basename}":`);
            const keeper = this.selectKeeper(files);
            console.log(`   ✅ KEEP: ${keeper.relativePath}`);

            for (const file of files) {
                if (file.path === keeper.path) continue;
                console.log(`   📦 ARCHIVE: ${file.relativePath}`);
                this.archiveFile(file.path, 'conflict');
            }
        }
    }

    /**
     * Run the deduplication process
     */
    run() {
        console.log('🧹 VE Duplicate File Cleaner');
        console.log('============================');
        console.log(`Mode: ${this.dryRun ? 'DRY-RUN (no changes)' : 'APPLY (will modify files)'}`);
        console.log(`Root: ${this.rootDir}`);
        console.log(`Preferred paths: ${this.preferredPaths.join(', ')}`);

        // Scan files
        const files = this.scanDirectory(this.rootDir);

        // Index files
        this.indexFiles(files);

        // Process duplicates
        this.processIdenticalDuplicates();
        this.processConflictingDuplicates();

        // Print summary
        this.printSummary();
    }

    /**
     * Print summary statistics
     */
    printSummary() {
        console.log('\n📊 Summary');
        console.log('==========');
        console.log(`Files scanned:            ${this.stats.scanned}`);
        console.log(`Identical duplicates:     ${this.stats.identicalDuplicates}`);
        console.log(`Conflicting duplicates:   ${this.stats.conflictingDuplicates}`);
        console.log(`Files deleted:            ${this.stats.deleted}`);
        console.log(`Files archived:           ${this.stats.archived}`);

        if (this.dryRun) {
            console.log('\n💡 This was a DRY-RUN. Use --apply to execute changes.');
        } else {
            console.log('\n✅ Deduplication complete!');
            if (this.stats.archived > 0) {
                console.log(`📦 Archived files are in .archive/duplicates/ - review them manually.`);
            }
        }
    }
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);

    const options = {
        dryRun: !args.includes('--apply'),
        preferredPaths: ['src', 'lib', 'app', 'server', 'client'],
    };

    // Parse --prefer option
    const preferIndex = args.indexOf('--prefer');
    if (preferIndex !== -1 && args[preferIndex + 1]) {
        options.preferredPaths = args[preferIndex + 1].split(',').map(s => s.trim());
    }

    const cleaner = new DuplicateFileCleaner(options);
    cleaner.run();
}

export default DuplicateFileCleaner;
