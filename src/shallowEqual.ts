import { deepEqual } from 'fast-equals';

export default function shallowEqual(
  oldProps: any,
  newProps: any,
  deepKeys?: Set<string> | string[]
) {
  if (Object.is(oldProps, newProps)) {
    return true;
  }

  if (
    typeof oldProps !== 'object' ||
    oldProps === null ||
    typeof newProps !== 'object' ||
    newProps === null
  ) {
    return false;
  }

  const oldKeys = Object.keys(oldProps);
  const newKeys = Object.keys(newProps);

  if (oldKeys.length !== newKeys.length) {
    return false;
  }

  const deepKeysSet = deepKeys instanceof Set ? deepKeys : new Set(deepKeys);

  for (let i = 0; i < oldKeys.length; i++) {
    const currentKey = oldKeys[i]!;
    if (!Object.hasOwnProperty.call(newProps, currentKey)) {
      return false;
    }
    if (
      typeof oldProps[currentKey] === 'object' &&
      typeof newProps[currentKey] === 'object' &&
      deepKeysSet.has(currentKey)
    ) {
      const isEq = deepEqual(oldProps[currentKey], newProps[currentKey]);
      if (!isEq) return false;
    } else if (!Object.is(oldProps[currentKey], newProps[currentKey])) {
      return false;
    }
  }

  return true;
}
