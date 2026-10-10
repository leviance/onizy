import assert from 'node:assert/strict';
import test from 'node:test';
import { createNavigationScrollState, updateNavigationScroll } from './navigation-scroll.ts';

const scroll = (state, offset, dimensions = {}) =>
  updateNavigationScroll(state, {
    offset,
    contentHeight: 2000,
    viewportHeight: 800,
    ...dimensions,
  });

test('a downward gesture hides navigation once and a pause does not reveal it', () => {
  const initial = createNavigationScrollState();
  const hidden = scroll(initial, 40);
  assert.equal(initial.visible, true);
  assert.equal(hidden.visible, false);
  assert.equal(scroll(hidden, 500).visible, false);
  assert.equal(scroll(hidden, 40), hidden);
});

test('a clear first scroll sample triggers motion without waiting for a long swipe', () => {
  const hidden = scroll(createNavigationScrollState(), 5);
  assert.equal(hidden.visible, false);
  const downward = scroll(hidden, 400);
  assert.equal(scroll(downward, 396).visible, true);
});

test('small reversals accumulate before triggering a complete visibility change', () => {
  let state = scroll(createNavigationScrollState(), 400);
  for (const offset of [399, 398, 397]) {
    state = scroll(state, offset);
    assert.equal(state.visible, false);
  }
  state = scroll(state, 396);
  assert.equal(state.visible, true);
  state = scroll(state, 393);
  state = scroll(state, 395);
  assert.equal(state.visible, true);
  state = scroll(state, 397);
  assert.equal(state.visible, false);
});

test('upward scrolling reveals navigation while still far from the top', () => {
  const hidden = scroll(createNavigationScrollState(), 900);
  const visible = scroll(hidden, 888);
  assert.equal(visible.visible, true);
  assert.equal(scroll(visible, 600).visible, true);
});

test('top bounce keeps navigation visible and bottom bounce cannot reverse direction', () => {
  let state = scroll(createNavigationScrollState(), -80);
  state = scroll(state, -20);
  state = scroll(state, 0);
  state = scroll(state, 2);
  assert.equal(state.visible, true);
  state = scroll(state, 1200);
  assert.equal(state.visible, false);
  for (const offset of [1280, 1250, 1220, 1200]) {
    const next = scroll(state, offset);
    assert.equal(next, state);
    assert.equal(next.visible, false);
    state = next;
  }
  assert.equal(scroll(state, 1192).visible, true);
});

test('non-scrollable or shortened content restores navigation without invalid offsets', () => {
  const hidden = scroll(createNavigationScrollState(), 500);
  for (const contentHeight of [0, 700, 800]) {
    assert.deepEqual(scroll(hidden, 500, { contentHeight }), createNavigationScrollState());
  }
  assert.equal(scroll(hidden, 0).visible, true);
});

test('navigation clearance alone does not make a short page hide its navigation', () => {
  const state = scroll(createNavigationScrollState(), 40, {
    contentHeight: 900,
    navigationPadding: 112,
  });
  assert.equal(state.visible, true);
  assert.equal(state.offset, 0);
});

test('changing navigation padding at the bottom cannot create a visibility loop', () => {
  let state = scroll(createNavigationScrollState(), 1180);
  state = scroll(state, 1168);
  assert.equal(state.visible, true);
  state = scroll(state, 1180, { contentHeight: 2112, navigationPadding: 112 });
  assert.equal(state.visible, false);
  state = scroll(state, 1200);
  assert.equal(state.visible, false);
  assert.equal(scroll(state, 1200), state);
  assert.equal(scroll(state, 1192).visible, true);
});

test('a layout clamp after content shrinks does not count as an upward gesture', () => {
  const hidden = scroll(createNavigationScrollState(), 1180);
  const clamped = scroll(hidden, 1100, { contentHeight: 1900 });
  assert.equal(clamped.visible, false);
  assert.equal(clamped.offset, 1100);
  assert.equal(scroll(clamped, 1092, { contentHeight: 1900 }).visible, true);
});

test('invalid scroll measurements preserve the last valid state', () => {
  const state = scroll(createNavigationScrollState(), 300);
  assert.equal(scroll(state, NaN), state);
  assert.equal(scroll(state, Infinity), state);
  assert.equal(scroll(state, 100, { contentHeight: Infinity }), state);
  assert.equal(scroll(state, 100, { viewportHeight: NaN }), state);
  assert.equal(scroll(state, 100, { navigationPadding: NaN }), state);
});
