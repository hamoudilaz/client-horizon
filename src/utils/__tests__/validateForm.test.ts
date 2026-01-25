import { describe, it, expect } from 'vitest';
import validateInput, { validateInputSell } from '../validateForm';
import type { settings } from '../constants';

// Helper to create valid config
const createConfig = (overrides: Partial<settings> = {}): settings => ({
  mint: 'So11111111111111111111111111111111111111112', // 44 chars - valid
  buyAmount: 0.5,
  slippage: 1,
  fee: 0.001,
  jitoFee: 0.005,
  node: false,
  ...overrides,
});

describe('validateInput', () => {
  describe('slippage validation', () => {
    it('returns error when slippage is too low', () => {
      const config = createConfig({ slippage: 0.001 });
      expect(validateInput(config, 10, true, false)).toBe(
        'Slippage must be between 0.01% and 100%'
      );
    });

    it('returns error when slippage exceeds 100', () => {
      const config = createConfig({ slippage: 101 });
      expect(validateInput(config, 10, true, false)).toBe(
        'Slippage must be between 0.01% and 100%'
      );
    });

    it('accepts valid slippage', () => {
      const config = createConfig({ slippage: 50 });
      expect(validateInput(config, 10, true, false)).toBe(true);
    });
  });

  describe('jitoFee validation', () => {
    it('returns error when fee exceeds 0.01', () => {
      const config = createConfig({ jitoFee: 0.02 });
      expect(validateInput(config, 10, true, false)).toBe('Fee can maximum be 0.01');
    });
  });

  describe('mint address validation', () => {
    it('returns error for too short mint address', () => {
      const config = createConfig({ mint: 'short' });
      expect(validateInput(config, 10, true, false)).toBe('Invalid contract address');
    });

    it('returns error for too long mint address', () => {
      const config = createConfig({ mint: 'a'.repeat(50) });
      expect(validateInput(config, 10, true, false)).toBe('Invalid contract address');
    });
  });

  describe('buy amount validation (non-demo mode)', () => {
    it('returns error when buy amount exceeds 5 SOL', () => {
      const config = createConfig({ buyAmount: 6 });
      expect(validateInput(config, 10, true, false)).toBe('Amount must be between 0 and 5');
    });

    it('returns error when buy amount exceeds wallet balance', () => {
      const config = createConfig({ buyAmount: 3 });
      expect(validateInput(config, 2, true, false)).toContain('You dont have enough wSOL');
    });
  });

  describe('demo mode validation', () => {
    it('allows higher buy amounts in demo mode', () => {
      const config = createConfig({ buyAmount: 100 });
      expect(validateInput(config, 500, true, true)).toBe(true);
    });

    it('returns error when demo buy amount exceeds 5000', () => {
      const config = createConfig({ buyAmount: 5001 });
      expect(validateInput(config, 6000, true, true)).toBe('Amount must be between 0 and 5000');
    });
  });
});

describe('validateInputSell', () => {
  it('returns error for invalid sell amount', () => {
    const config = createConfig({ sellAmount: 0 });
    expect(validateInputSell(config)).toBe('Amount must be a whole number between 1 and 100');
  });

  it('returns error for non-integer sell amount', () => {
    const config = createConfig({ sellAmount: 50.5 });
    expect(validateInputSell(config)).toBe('Amount must be a whole number between 1 and 100');
  });

  it('accepts valid sell amount', () => {
    const config = createConfig({ sellAmount: 50 });
    expect(validateInputSell(config)).toBe(true);
  });
});
