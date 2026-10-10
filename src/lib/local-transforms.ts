import type { Binding, Capability } from './capability-adapter';
/** Adapted from the inspected jsFactorialMod in git4emet/wasm-js-ATBASH-omni-plexing.
 * Original builder: sylwia-lask/wasm-js-bench. Preserve the modular-factorial operation.
 * This JS path does not claim to run the repository's separate WASM benchmark.
 */
export function modularFactorial(input: unknown) {
  const n = (input as { n?: unknown } | null)?.n;
  if (typeof n !== 'number' || !Number.isSafeInteger(n) || n < 0 || n > 100000) throw new Error('Supply an integer n from 0 to 100000.');
  const modulus = 1000000007n;
  let result = 1n;
  for (let i = 1n; i <= BigInt(n); i++) result = result * i % modulus;
  return { n, modulus: Number(modulus), value: Number(result) };
}
export function connectLocal(capability: Capability): Binding | null {
  if (capability.source.repositoryId !== '1291654265') return null;
  return { capabilityId: capability.id, transport: 'local', run: async input => modularFactorial(input) };
}
