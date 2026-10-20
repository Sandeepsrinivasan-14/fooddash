import { describe, expect, it } from 'vitest';
import { AppReducer } from '../reducer/AppReducer';

const base = { orders: [{ orderId: '1', status: 'Preparing' }, { orderId: '2', status: 'Preparing' }], loading: true, error: null, filteredRestaurant: 'x', theme: 'light' };

describe('AppReducer', () => {
  it('SET_ORDERS stores orders and stops loading', () => {
    const s = AppReducer(base, { type: 'SET_ORDERS', payload: [] });
    expect(s.orders).toEqual([]);
    expect(s.loading).toBe(false);
  });
  it('SET_ERROR stores the error and stops loading', () => {
    const s = AppReducer(base, { type: 'SET_ERROR', payload: 'boom' });
    expect(s).toMatchObject({ error: 'boom', loading: false });
  });
  it('ADD_ORDER puts the new order first without mutating state', () => {
    const s = AppReducer(base, { type: 'ADD_ORDER', payload: { orderId: '3' } });
    expect(s.orders.map((o) => o.orderId)).toEqual(['3', '1', '2']);
    expect(base.orders).toHaveLength(2);
  });
  it('UPDATE_ORDER_STATUS changes only the matching order', () => {
    const s = AppReducer(base, { type: 'UPDATE_ORDER_STATUS', payload: { orderId: '2', status: 'Delivered' } });
    expect(s.orders.map((o) => o.status)).toEqual(['Preparing', 'Delivered']);
  });
  it('DELETE_ORDER removes the order', () => {
    expect(AppReducer(base, { type: 'DELETE_ORDER', payload: '1' }).orders.map((o) => o.orderId)).toEqual(['2']);
  });
  it('SET_FILTER and RESET_FILTER', () => {
    expect(AppReducer(base, { type: 'SET_FILTER', payload: 'Pizza' }).filteredRestaurant).toBe('Pizza');
    expect(AppReducer(base, { type: 'RESET_FILTER' }).filteredRestaurant).toBe('');
  });
  it('TOGGLE_THEME flips between light and dark', () => {
    const dark = AppReducer(base, { type: 'TOGGLE_THEME' });
    expect(dark.theme).toBe('dark');
    expect(AppReducer(dark, { type: 'TOGGLE_THEME' }).theme).toBe('light');
  });
  it('unknown actions return the same state', () => {
    expect(AppReducer(base, { type: 'NOPE' })).toBe(base);
  });
});
