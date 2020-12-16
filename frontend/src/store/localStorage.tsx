export function loadState(key: string) {
    try {
        const serializedState = localStorage.getItem(key);
        if (serializedState === null) {
        return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
}; 

export function saveState(key: string, value: any) {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch {
    // ignore write errors
  }
};