/**
 * Wait for a specified number of milliseconds.
 * @param ms Number of milliseconds to wait
 */
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate a random string.
 */
export const randomId = () => Math.random().toString(36).substring(2, 9);
