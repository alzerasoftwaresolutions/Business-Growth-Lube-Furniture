import { describe, it, expect } from 'vitest';
import { collectionsData } from '../collections';

describe('Collections Data Layer', () => {
  it('should contain all 4 core collections', () => {
    expect(collectionsData.length).toBe(4);
    const ids = collectionsData.map((c) => c.id);
    expect(ids).toEqual(['living', 'bedroom', 'dining', 'office']);
  });

  it('should have valid metadata, images, and descriptions for every collection', () => {
    collectionsData.forEach((collection) => {
      expect(collection.id).toBeTruthy();
      expect(collection.name).toBeTruthy();
      expect(collection.tagline).toBeTruthy();
      expect(collection.description).toBeTruthy();
      expect(collection.image).toMatch(/^\/assets\//);
      expect(collection.itemCountLabel).toBeTruthy();
    });
  });
});
