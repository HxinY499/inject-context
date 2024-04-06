export default function get(obj: any, path: string) {
  try {
    return new Function('obj', `return obj?.${path}`)(obj);
  } catch {
    return undefined;
  }
}
