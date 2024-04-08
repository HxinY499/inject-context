export default function get(obj: any, path: string) {
  try {
    const funBody = path.split(';')[0];
    return new Function('obj', `return obj?.${funBody}`)(obj);
  } catch {
    return undefined;
  }
}
