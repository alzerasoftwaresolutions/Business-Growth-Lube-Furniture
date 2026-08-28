import { describe, it, expect } from 'vitest';
import { productsData } from '../products';
import { collectionsData } from '../collections';

describe('Products Data Layer', () => {
  it('should contain populated product items', () => {
    expect(productsData.length).toBeGreaterThanOrEqual(12);
  });

  it('every product should map to a valid collectionId', () => {
    const validCollectionIds = collectionsData.map((c) => c.id);
    productsData.forEach((product) => {
      expect(validCollectionIds).toContain(product.collectionId);
      expect(product.id).toBeTruthy();
      expect(product.name).toBeTruthy();
      expect(product.shortDescription).toBeTruthy();
      expect(product.dimensions).toBeTruthy();
      expect(product.materials.length).toBeGreaterThan(0);
      expect(product.image).toMatch(/^\/assets\//);
    });
  });

  it('should have products distributed across all collections', () => {
    const collectionsWithProducts = new Set(productsData.map((p) => p.collectionId));
    expect(collectionsWithProducts.size).toBe(4);
  });
});
