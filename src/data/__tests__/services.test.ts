import { describe, it, expect } from 'vitest';
import { servicesData } from '../services';

describe('Services Data Layer', () => {
  it('should define all 3 phased service offerings', () => {
    expect(servicesData.length).toBe(3);
    const numbers = servicesData.map((s) => s.number);
    expect(numbers).toEqual(['01', '02', '03']);
  });

  it('every service should have required details and target audiences', () => {
    servicesData.forEach((service) => {
      expect(service.id).toBeTruthy();
      expect(service.title).toBeTruthy();
      expect(service.tagline).toBeTruthy();
      expect(service.description).toBeTruthy();
      expect(service.details.length).toBeGreaterThan(0);
      expect(service.suitableFor).toBeTruthy();
    });
  });
});
