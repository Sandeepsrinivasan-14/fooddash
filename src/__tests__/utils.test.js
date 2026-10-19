import { describe, expect, it } from 'vitest';
import {
  calculateItemSubtotal,
  filterOrdersByRestaurant,
  getOrderStats,
  getValidOrders,
  isValidOrder,
} from '../services/utils';

const good = { orderId: 'A1', restaurant: 'Pizza Palace', status: 'Delivered', totalAmount: 20, items: [{ name: 'Pizza', price: 10, quantity: 2 }] };

describe('isValidOrder', () => {
  it('accepts a normal order', () => expect(isValidOrder(good)).toBe(true));
  it('rejects missing or empty items', () => {
    expect(isValidOrder({ ...good, items: [] })).toBe(false);
    expect(isValidOrder({ ...good, items: undefined })).toBe(false);
    expect(isValidOrder({ ...good, items: 'pizza' })).toBe(false);
  });
  it('rejects zero or negative quantities', () => {
    expect(isValidOrder({ ...good, items: [{ quantity: 0 }] })).toBe(false);
    expect(isValidOrder({ ...good, items: [{ quantity: -1 }] })).toBe(false);
  });
  it('rejects non-numeric or non-positive totals', () => {
    expect(isValidOrder({ ...good, totalAmount: '20' })).toBe(false);
    expect(isValidOrder({ ...good, totalAmount: 0 })).toBe(false);
  });
});

describe('getValidOrders', () => {
  it('drops invalid orders', () => {
    expect(getValidOrders([good, { ...good, items: [] }])).toEqual([good]);
  });
});

describe('calculateItemSubtotal', () => {
  it('multiplies price by quantity', () => expect(calculateItemSubtotal({ price: 4.5, quantity: 2 })).toBe(9));
  it('returns 0 for missing data', () => {
    expect(calculateItemSubtotal(null)).toBe(0);
    expect(calculateItemSubtotal({ price: 5 })).toBe(0);
  });
});

describe('filterOrdersByRestaurant', () => {
  const orders = [good, { ...good, orderId: 'B2', restaurant: 'Sushi Bar' }];
  it('matches case-insensitively on a partial name', () => {
    expect(filterOrdersByRestaurant(orders, 'pizza')).toEqual([good]);
  });
  it('returns nothing for a blank filter', () => {
    expect(filterOrdersByRestaurant(orders, '   ')).toEqual([]);
  });
});

describe('getOrderStats', () => {
  it('counts only valid orders and is case-insensitive on status', () => {
    const orders = [
      good,
      { ...good, orderId: 'B', status: 'CANCELLED' },
      { ...good, orderId: 'C', status: 'Preparing' },
      { ...good, orderId: 'D', items: [] },
    ];
    expect(getOrderStats(orders)).toEqual({ totalOrders: 3, deliveredOrders: 1, cancelledOrders: 1 });
  });
});
