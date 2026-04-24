#!/usr/bin/env node

/**
 * Fix Markdown Lint Errors
 * Automatically fixes common markdown linting issues
 */

import { readFileSync, writeFileSync } from 'fs';

const files = [
    'README.md',
    'IMPLEMENTATION_COMPLETE.md',
    'SCHEMA_ARCHITECTURE.md',
    'PHASE2_COMPLETE.md',
    'FULLSTACK_README.md',
];

function fixMarkdownFile(filePath) {
    console.log(`\n📝 Fixing ${filePath}...`);
    let content = readFileSync(filePath, 'utf-8');
    let changes = 0;

    // Fix MD040: Add language to code fences without language
    const codeBlockRegex = /```\n([^`])/g;
    if (codeBlockRegex.test(content)) {
        content = content.replace(/```\n([^`])/g, '```text\n$1');
        changes++;
        console.log('  ✓ Fixed MD040: Added language to code fences');
    }

    // Fix MD036: Convert **Bold Text** used as headings to proper headings
    // Match lines that are only bold text (likely headings)
    const boldHeadingRegex = /^(\*\*[^*\n]+\*\*)$/gm;
    const boldMatches = content.match(boldHeadingRegex);
    if (boldMatches) {
        boldMatches.forEach(match => {
            const text = match.replace(/\*\*/g, '');
            // Convert to h4
            const heading = `#### ${text}`;
            content = content.replace(match, heading);
        });
        changes++;
        console.log(`  ✓ Fixed MD036: Converted ${boldMatches.length} bold text to headings`);
    }

    // Fix MD024: Rename duplicate headings by adding context
    const headings = {};
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
            const [, hashes, text] = headingMatch;
            if (headings[text]) {
                // This is a duplicate - we'll leave it for now as context matters
                console.log(`  ⚠ Found duplicate heading: "${text}" (manual review needed)`);
            } else {
                headings[text] = true;
            }
        }
    }

    // Fix MD029: Ordered list prefix (ensure consistent numbering)
    content = content.replace(/^\d+\.\s/gm, (match, offset) => {
        // Find which list item this is
        const beforeText = content.substring(0, offset);
        const lastListItem = beforeText.lastIndexOf('\n1. ');
        if (lastListItem === -1 || offset - lastListItem > 1000) {
            return '1. '; // Start of new list
        }
        return match; // Keep as is if part of existing list
    });

    writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✅ Applied ${changes} fix(es) to ${filePath}`);
    return changes;
}

let totalChanges = 0;
files.forEach(file => {
    try {
        const changes = fixMarkdownFile(file);
        totalChanges += changes;
    } catch (error) {
        console.error(`  ❌ Error fixing ${file}:`, error.message);
    }
});

console.log(`\n✨ Total fixes applied: ${totalChanges}`);
console.log('\nNote: Some issues (MD024 duplicate headings) may require manual review for context.');
