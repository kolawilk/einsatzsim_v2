import * as yaml from 'js-yaml';
import { Mission, LoadedMission, MissionLoadResult, MissionValidationError } from '@/types/mission';

export type { Mission, LoadedMission, MissionLoadResult, MissionValidationError };

/**
 * Validates a mission object against the expected schema
 */
function validateMission(mission: any, source: string): MissionLoadResult {
  const errors: MissionValidationError[] = [];

  // Check required top-level fields
  if (!mission || typeof mission !== 'object') {
    return {
      success: false,
      errors: [{ field: 'mission', message: 'Mission must be a valid object', value: mission }]
    };
  }

  if (!mission.id || typeof mission.id !== 'string') {
    errors.push({ field: 'id', message: 'Mission ID must be a non-empty string', value: mission.id });
  }

  if (!mission.title || typeof mission.title !== 'string') {
    errors.push({ field: 'title', message: 'Mission title must be a non-empty string', value: mission.title });
  }

  if (!mission.states || typeof mission.states !== 'object') {
    errors.push({ field: 'states', message: 'Mission must have a states object', value: mission.states });
    return { success: false, errors };
  }

  // Validate required states
  const requiredStates = ['idle', 'calling', 'alerting', 'deploying', 'arriving', 'returning'];
  for (const state of requiredStates) {
    if (!mission.states[state] || typeof mission.states[state] !== 'object') {
      errors.push({
        field: `states.${state}`,
        message: `State '${state}' must be a valid object`,
        value: mission.states[state]
      });
    }
  }

  // Validate state fields
  for (const [stateName, state] of Object.entries(mission.states)) {
    if (state && typeof state === 'object') {
      const stateObj = state as any;
      
      // Check required image field
      if (!stateObj.image || typeof stateObj.image !== 'string') {
        errors.push({
          field: `states.${stateName}.image`,
          message: 'State image must be a non-empty string (path to image)',
          value: stateObj.image
        });
      }

      // Validate sound fields if present
      const soundFields = ['sound_in', 'sound_floor', 'sound_random', 'sound_sequence', 'sound_out'];
      for (const soundField of soundFields) {
        const value = stateObj[soundField];
        if (value !== undefined) {
          const isValidStringOrArray = 
            typeof value === 'string' || 
            (Array.isArray(value) && value.every(v => typeof v === 'string'));
          
          if (!isValidStringOrArray) {
            errors.push({
              field: `states.${stateName}.${soundField}`,
              message: `Sound field must be a string or array of strings`,
              value: value
            });
          }
        }
      }

      // Validate duration_ms if present
      if (stateObj.duration_ms !== undefined && typeof stateObj.duration_ms !== 'number') {
        errors.push({
          field: `states.${stateName}.duration_ms`,
          message: 'Duration must be a number (milliseconds)',
          value: stateObj.duration_ms
        });
      }

      // Validate auto_advance if present
      if (stateObj.auto_advance !== undefined && typeof stateObj.auto_advance !== 'boolean') {
        errors.push({
          field: `states.${stateName}.auto_advance`,
          message: 'Auto advance must be a boolean',
          value: stateObj.auto_advance
        });
      }
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      mission: mission as Mission,
      source
    }
  };
}

/**
 * Loads a mission from a YAML string
 */
export function loadMissionFromYaml(yamlString: string, source: string = 'inline'): MissionLoadResult {
  try {
    const parsed = yaml.load(yamlString) as any;
    
    // Handle the case where YAML has a 'mission' wrapper
    const mission = parsed.mission || parsed;
    
    return validateMission(mission, source);
  } catch (error: any) {
    return {
      success: false,
      errors: [{
        field: 'yaml',
        message: error.message || 'Failed to parse YAML',
        value: yamlString.substring(0, 100) + '...'
      }]
    };
  }
}

/**
 * Loads a mission from a public URL (works in browser and server)
 */
export async function loadMissionFromUrl(url: string): Promise<MissionLoadResult> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return {
        success: false,
        errors: [{
          field: 'url',
          message: `Failed to fetch mission: ${response.status} ${response.statusText}`,
          value: url
        }]
      };
    }
    const yamlString = await response.text();
    return loadMissionFromYaml(yamlString, url);
  } catch (error: any) {
    return {
      success: false,
      errors: [{
        field: 'url',
        message: error.message || `Failed to load mission from URL`,
        value: url
      }]
    };
  }
}

/**
 * Formats validation errors for display
 */
export function formatValidationError(error: MissionValidationError): string {
  let msg = `❌ ${error.message}`;
  if (error.value !== undefined) {
    const valueStr = JSON.stringify(error.value);
    if (valueStr.length > 50) {
      msg += ` (value: ${valueStr.substring(0, 50)}...)`;
    } else {
      msg += ` (value: ${valueStr})`;
    }
  }
  return msg;
}

/**
 * Formats all errors for display
 */
export function formatValidationErrors(errors: MissionValidationError[]): string {
  return errors.map(formatValidationError).join('\n');
}
