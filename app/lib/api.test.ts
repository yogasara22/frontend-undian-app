import { describe, it, expect, vi, afterEach } from 'vitest';
import { dummyParticipants, dummyPrizes } from './dummy';

// api.ts reads NEXT_PUBLIC_API_URL at module load time, so we use
// vi.doMock + dynamic import to re-evaluate the module per test.

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe('getAppMode', () => {
  it('returns "demo" when NEXT_PUBLIC_API_URL is not set', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
    const { getAppMode } = await import('./api');
    expect(getAppMode()).toBe('demo');
  });

  it('returns "live" when NEXT_PUBLIC_API_URL is set', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com');
    vi.resetModules();
    const { getAppMode } = await import('./api');
    expect(getAppMode()).toBe('live');
  });
});

describe('drawLottery — Demo Mode', () => {
  it('returns a winner from dummyParticipants', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
    vi.resetModules();
    const { drawLottery } = await import('./api');
    const result = await drawLottery();
    const participantNames = dummyParticipants.map(p => p.name);
    expect(participantNames).toContain(result.winner.name);
  });

  it('returns a prize from dummyPrizes', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
    vi.resetModules();
    const { drawLottery } = await import('./api');
    const result = await drawLottery();
    const prizeNames = dummyPrizes.map(p => p.name);
    expect(prizeNames).toContain(result.prize.name);
  });

  it('result has winner and prize fields', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
    vi.resetModules();
    const { drawLottery } = await import('./api');
    const result = await drawLottery();
    expect(result).toHaveProperty('winner');
    expect(result).toHaveProperty('prize');
    expect(result.winner).toHaveProperty('name');
    expect(result.prize).toHaveProperty('name');
  });
});

describe('drawLottery — Live Mode error handling', () => {
  it('throws a user-friendly error on network failure', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com');
    vi.resetModules();
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('Failed to fetch'));
    const { drawLottery } = await import('./api');
    await expect(drawLottery()).rejects.toThrow('Tidak dapat terhubung ke server');
  });

  it('throws specific error for 404 response', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com');
    vi.resetModules();
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(null, { status: 404 })
    );
    const { drawLottery } = await import('./api');
    await expect(drawLottery()).rejects.toThrow('Endpoint API tidak ditemukan');
  });

  it('throws server error message for 5xx responses', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com');
    vi.resetModules();
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(null, { status: 500 })
    );
    const { drawLottery } = await import('./api');
    await expect(drawLottery()).rejects.toThrow('Server error (500)');
  });

  it('throws generic error for other non-2xx responses', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com');
    vi.resetModules();
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(null, { status: 403 })
    );
    const { drawLottery } = await import('./api');
    await expect(drawLottery()).rejects.toThrow('status 403');
  });
});
