import { describe, it, expect } from 'vitest';
import { dummyParticipants, dummyPrizes } from './dummy';

describe('dummyParticipants', () => {
  it('has at least 20 participants', () => {
    expect(dummyParticipants.length).toBeGreaterThanOrEqual(20);
  });

  it('each participant has id, name, and department', () => {
    for (const p of dummyParticipants) {
      expect(p.id).toBeDefined();
      expect(typeof p.name).toBe('string');
      expect(p.name.length).toBeGreaterThan(0);
      expect(typeof p.department).toBe('string');
    }
  });
});

describe('dummyPrizes', () => {
  it('has at least 5 prizes', () => {
    expect(dummyPrizes.length).toBeGreaterThanOrEqual(5);
  });

  it('each prize has id, name, and value in Rupiah', () => {
    for (const prize of dummyPrizes) {
      expect(prize.id).toBeDefined();
      expect(typeof prize.name).toBe('string');
      expect(prize.name.length).toBeGreaterThan(0);
      expect(prize.value).toMatch(/^Rp/);
    }
  });
});
