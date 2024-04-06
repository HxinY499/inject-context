import { expect, test } from 'vitest';
import get from '../src/get';

test('[get] base', () => {
  const obj = {
    a: {
      b: {
        c: 1,
      },
    },
  };
  expect(get(obj, 'a.b')).toBe(obj.a.b);

  const obj2 = {
    a: {
      b: {
        arr: [1, 2, { name: 'xxx' }],
      },
    },
  };
  expect(get(obj2, 'a.b.arr[2].name')).toBe('xxx');
});

test('[get] array', () => {
  const arr = [1, 2, 3, { name: 'xxx' }];
  expect(get(arr, '[3].name')).toBe('xxx');
});

test('[get] map', () => {
  const map = new Map([['1', { name: 'xxx' }]]);
  expect(get(map, "get('1').name")).toBe('xxx');
});
