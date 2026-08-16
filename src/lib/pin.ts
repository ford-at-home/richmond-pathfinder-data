import lock from "@/content/data/analysis.lock.json";

export const analysisPin = lock;

export const pinRepo = lock.repo;
export const pinRef = lock.ref;
export const pinShort = lock.ref.slice(0, 12);
export const pinSynced = lock.syncedAt.slice(0, 10);
export const pinRepoUrl = `https://github.com/${lock.repo}`;
export const pinCommitUrl = `${pinRepoUrl}/commit/${lock.ref}`;
