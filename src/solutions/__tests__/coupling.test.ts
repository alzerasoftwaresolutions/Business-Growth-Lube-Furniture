import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Solution Integration Foundation - Coupling & Dependency Direction (Lube Furniture)', () => {
  const srcDir = path.resolve(__dirname, '../../');
  const solutionsDir = path.resolve(__dirname, '../');
  const proofsDir = path.resolve(__dirname, '../proofs');

  function getAllFiles(dir: string, fileList: string[] = []): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        getAllFiles(fullPath, fileList);
      } else if (/\.(tsx?|jsx?)$/.test(entry.name) && !entry.name.includes('.test.')) {
        fileList.push(fullPath);
      }
    }
    return fileList;
  }

  it('Core code never imports concrete proof modules or vendor solutions', () => {
    const allFiles = getAllFiles(srcDir);
    const coreFiles = allFiles.filter((f) => !f.startsWith(solutionsDir));

    const forbiddenPatterns = [
      /from\s+['"].*proofs.*['"]/,
      /from\s+['"].*bookingProof.*['"]/,
      /from\s+['"].*inquiryProof.*['"]/,
      /from\s+['"].*cmsProof.*['"]/,
      /from\s+['"].*integrationProof.*['"]/,
      /from\s+['"].*salesforce.*['"]/i,
      /from\s+['"].*hubspot.*['"]/i,
    ];

    for (const file of coreFiles) {
      const content = fs.readFileSync(file, 'utf8');
      for (const pattern of forbiddenPatterns) {
        expect(
          pattern.test(content),
          `Core file "${path.relative(srcDir, file)}" violates dependency direction by importing concrete solution: ${pattern}`
        ).toBe(false);
      }
    }
  });

  it('Proof modules never import each other (Solution A -> Solution B isolation)', () => {
    if (!fs.existsSync(proofsDir)) return;
    const proofFiles = fs.readdirSync(proofsDir).filter((f) => /\.(tsx?|jsx?)$/.test(f));

    for (const proofFile of proofFiles) {
      const filePath = path.join(proofsDir, proofFile);
      const content = fs.readFileSync(filePath, 'utf8');

      // Check imports of other proof files
      for (const otherProof of proofFiles) {
        if (otherProof !== proofFile) {
          const baseName = otherProof.replace(/\.[^/.]+$/, '');
          const pattern = new RegExp(`from\\s+['"].*(${baseName}).*['"]`);
          expect(
            pattern.test(content),
            `Proof module "${proofFile}" violates isolation by importing another solution "${otherProof}"`
          ).toBe(false);
        }
      }
    }
  });

  it('Registry logic contains zero hardcoded solution IDs or vendor logic', () => {
    const registryFile = path.join(solutionsDir, 'registry.ts');
    const content = fs.readFileSync(registryFile, 'utf8');

    expect(content).not.toContain('booking-proof');
    expect(content).not.toContain('inquiry-proof');
    expect(content).not.toContain('cms-proof');
    expect(content).not.toContain('integration-proof');
    expect(content).not.toContain('lube');
    expect(content).not.toContain('furniture');
  });
});
