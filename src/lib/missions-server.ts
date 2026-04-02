/**
 * Server-only mission loading utilities
 * These functions can only be used in server components or API routes
 */

import { loadMissionFromYaml, loadMissionFromUrl } from './missions';
import type { LoadedMission } from '@/types/mission';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

const __filename = url.fileURLToPath(new URL('.', import.meta.url));
const __dirname = path.dirname(__filename);

/**
 * Loads a mission from a YAML file path
 * Server-side only
 */
export async function loadMissionFromFile(filePath: string) {
  const yamlString = fs.readFileSync(filePath, 'utf-8');
  return loadMissionFromYaml(yamlString, filePath);
}

/**
 * Loads all missions from a directory
 * Server-side only
 */
export async function loadMissionsFromDirectory(dirPath: string): Promise<LoadedMission[]> {
  const results: LoadedMission[] = [];
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    if (file.endsWith('.yaml') || file.endsWith('.yml')) {
      const filePath = path.join(dirPath, file);
      const result = await loadMissionFromFile(filePath);
      
      if (result.success) {
        results.push(result.data);
      } else {
        console.warn(`Failed to load mission from ${filePath}:`, result.errors);
      }
    }
  }

  return results;
}

/**
 * Loads all missions from the public/missions directory
 * Server-side only
 */
export async function loadAllMissions(): Promise<LoadedMission[]> {
  const missionsDir = path.join(process.cwd(), 'public', 'missions');
  
  if (!fs.existsSync(missionsDir)) {
    fs.mkdirSync(missionsDir, { recursive: true });
    return [];
  }
  
  return loadMissionsFromDirectory(missionsDir);
}
