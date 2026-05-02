import type { AppMode, DrawResult, ApiResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.whoisthewinners.com';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/json',
      ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = `API Error: ${response.status}`;
    try {
      const errData = await response.json();
      if (errData.errors) {
        // Collect all validation errors into a single string
        const errorMessages = Object.values(errData.errors).flat().join('\n');
        message = `${errData.message || 'Validation Error'}\n${errorMessages}`;
      } else {
        message = errData.message || message;
      }
    } catch (e) {
      // Ignore JSON parse error
    }
    throw new Error(message);
  }

  // Handle empty responses (like 204 No Content for DELETE)
  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function getAppMode(): AppMode {
  return API_URL ? 'live' : 'demo';
}

export async function drawLottery(prizeId?: number | null): Promise<DrawResult> {
  // Always use Live Mode with the new backend integration
  const data = await fetchAPI('/api/lottery/draw', {
    method: 'POST',
    body: prizeId ? JSON.stringify({ prize_id: prizeId }) : undefined,
  });
  return data.data;
}

// Remove drawFromDummy
