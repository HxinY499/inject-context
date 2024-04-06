import { expect, test } from 'vitest';
import shallowEqual from '../src/shallowEqual';

test('[shallowEqual] base', () => {
  const obj1 = {
    a: 1,
    b: 2,
    c: 3,
  };
  const obj2 = {
    a: 1,
    b: 2,
    c: 3,
  };
  const obj3 = {
    a: 1,
  };

  expect.soft(obj1 === obj2).toEqual(false);
  expect(shallowEqual(obj1, obj2)).toEqual(true);
  expect(shallowEqual(obj1, obj3)).toEqual(false);
});

test('[shallowEqual] deep', () => {
  const obj1 = {
    a: {
      b: {
        c: 1,
      },
    },
  };
  const obj2 = {
    a: {
      b: {
        c: 1,
      },
    },
  };

  expect.soft(obj1 === obj2).toEqual(false);
  expect(shallowEqual(obj1, obj2)).toEqual(false);
  expect(shallowEqual(obj1, obj2, ['a'])).toEqual(true);
});
