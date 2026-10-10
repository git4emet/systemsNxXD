import data from './repository-registry.json';
import type { Capability } from './capability-adapter';
export const repositories = data.repositories;
export type Repository = typeof repositories[number];
export const observedAt = data.observedAt;
export function sourceUrl(repo: Repository) {
  return `https://github.com/${repo.repository}/blob/${repo.commit}/${repo.source.path}`;
}
export function capabilityFor(repo: Repository): Capability {
  return { id: `${repo.id}:transform`, label: repo.role, contexts: [repo.facet], source: { repositoryId: repo.id, repository: repo.repository, commit: repo.commit, path: repo.source.path, blob: repo.source.sha } };
}
export function findRepositories(query: string) {
  const term = query.trim().toLowerCase();
  return repositories.filter(r => [r.name, r.implemented, r.role, r.facet, ...r.aliases].join(' ').toLowerCase().includes(term));
}
