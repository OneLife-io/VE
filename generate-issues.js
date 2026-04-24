#!/usr/bin/env node

/**
 * GitHub Issues Generator
 * 
 * This script generates GitHub issues from the roadmap CSV file.
 * It can either create issues directly via GitHub API or generate
 * a formatted markdown file for manual import.
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read CSV file
const csvPath = join(__dirname, 'roadmap-tasks.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
function parseCSV(content) {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        const values = line.split(',');
        const task = {};
        headers.forEach((header, index) => {
            task[header] = values[index] || '';
        });
        return task;
    });
}

// Generate GitHub Issue Format
function generateIssueMarkdown(task) {
    const labels = task.Labels.split(';').filter(l => l).join(', ');

    return `## ${task.Title}

**Phase:** ${task.Phase}  
**Sprint:** ${task.Sprint}  
**Priority:** ${task.Priority}  
**Estimate:** ${task['Estimate (days)']} days  

### Description
${task.Description}

### Dependencies
${task.Dependencies || 'None'}

### Labels
\`${labels}\`

### Checklist
- [ ] Implementation complete
- [ ] Tests written
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Deployed to staging

---
*Task ID: ${task['Task ID']}*
`;
}

// Parse tasks
const tasks = parseCSV(csvContent);

// Generate issues markdown file
let issuesMarkdown = `# VE Full-Stack Application - GitHub Issues

**Generated:** ${new Date().toISOString()}  
**Total Tasks:** ${tasks.length}

---

`;

// Group by phase
const phases = {};
tasks.forEach(task => {
    const phase = task.Phase;
    if (!phases[phase]) {
        phases[phase] = [];
    }
    phases[phase].push(task);
});

// Generate issues grouped by phase
Object.keys(phases).forEach(phase => {
    issuesMarkdown += `\n## Phase: ${phase}\n\n`;

    phases[phase].forEach(task => {
        issuesMarkdown += `### Issue: ${task['Task ID']} - ${task.Title}\n\n`;
        issuesMarkdown += generateIssueMarkdown(task);
        issuesMarkdown += '\n\n';
    });
});

// Write to file
const outputPath = join(__dirname, 'GITHUB_ISSUES.md');
fs.writeFileSync(outputPath, issuesMarkdown);

console.log(`✅ Generated ${tasks.length} issues in GITHUB_ISSUES.md`);
console.log(`\nPhase Breakdown:`);
Object.keys(phases).forEach(phase => {
    console.log(`  - ${phase}: ${phases[phase].length} tasks`);
});

// Generate GitHub CLI commands
let ghCommands = `#!/bin/bash
# GitHub Issues Creation Script
# Run this script to create all issues in your GitHub repository
# Requires: GitHub CLI (gh) to be installed and authenticated
# Usage: ./create-github-issues.sh

echo "Creating GitHub issues for VE Full-Stack Application..."
echo "Total issues to create: ${tasks.length}"
echo ""

`;

tasks.forEach((task, index) => {
    const labels = task.Labels.split(';').filter(l => l).map(l => `"${l}"`).join(',');
    const title = `[${task['Task ID']}] ${task.Title}`.replace(/"/g, '\\"');
    const body = `**Phase:** ${task.Phase}
**Sprint:** ${task.Sprint}
**Priority:** ${task.Priority}
**Estimate:** ${task['Estimate (days)']} days

${task.Description}

**Dependencies:** ${task.Dependencies || 'None'}

**Checklist:**
- [ ] Implementation complete
- [ ] Tests written
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Deployed to staging`.replace(/"/g, '\\"').replace(/\n/g, '\\n');

    ghCommands += `echo "Creating issue ${index + 1}/${tasks.length}: ${task['Task ID']}..."
gh issue create --title "${title}" --body "${body}" --label ${labels} --assignee "@me"

`;
});

ghCommands += `echo ""
echo "✅ All issues created successfully!"
`;

// Write GitHub CLI script
const ghScriptPath = join(__dirname, 'create-github-issues.sh');
fs.writeFileSync(ghScriptPath, ghCommands);
fs.chmodSync(ghScriptPath, '755');

console.log(`\n✅ Generated GitHub CLI script: create-github-issues.sh`);
console.log(`\nTo create issues in GitHub:`);
console.log(`  1. Install GitHub CLI: https://cli.github.com/`);
console.log(`  2. Authenticate: gh auth login`);
console.log(`  3. Run: ./create-github-issues.sh`);
console.log(`\nOr manually import GITHUB_ISSUES.md into your issue tracker.`);
