import { describe, it, expect } from 'vitest';
import { materialsData } from '../materials';

describe('Materials Data Layer', () => {
  it('should contain curated material specifications', () => {
    expect(materialsData.length).toBeGreaterThan(0);
    materialsData.forEach((mat) => {
      expect(mat.id).toBeTruthy();
      expect(mat.title).toBeTruthy();
      expect(mat.category).toBeTruthy();
      expect(mat.description).toBeTruthy();
      expect(mat.image).toMatch(/^\/assets\//);
    });
  });
});
