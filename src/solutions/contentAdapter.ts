import { defaultRegistry, SolutionRegistry } from './registry';

export async function resolveSolutionContent<T>(
  key: string,
  fallbackContent: T,
  registryInstance: SolutionRegistry = defaultRegistry
): Promise<T> {
  return registryInstance.resolveContent<T>(key, fallbackContent);
}
