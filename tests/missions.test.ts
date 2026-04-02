import { loadMissionFromYaml, formatValidationErrors } from '@/lib/missions';
import { describe, it, expect } from 'vitest';

describe('Mission Loader (Unit Tests)', () => {
  describe('loadMissionFromYaml', () => {
    it('should load a valid mission', () => {
      const yaml = `
mission:
  id: test-mission
  title: Test Mission
  states:
    idle:
      image: /images/test.jpg
      sound_in: /audio/test.mp3
      auto_advance: false
    calling:
      image: /images/calling.jpg
      sound_in: /audio/calling.mp3
      auto_advance: true
      duration_ms: 5000
    alerting:
      image: /images/alerting.jpg
      sound_in: /audio/alerting.mp3
      auto_advance: true
      duration_ms: 5000
    deploying:
      image: /images/deploying.jpg
      sound_in: /audio/deploying.mp3
      auto_advance: true
      duration_ms: 5000
    arriving:
      image: /images/arriving.jpg
      sound_in: /audio/arriving.mp3
      auto_advance: true
      duration_ms: 5000
    returning:
      image: /images/returning.jpg
      sound_in: /audio/returning.mp3
      auto_advance: true
      duration_ms: 5000
`;

      const result = loadMissionFromYaml(yaml);
      
      expect(result.success).toBe(true);
      expect(result.data.mission.id).toBe('test-mission');
      expect(result.data.mission.title).toBe('Test Mission');
      expect(Object.keys(result.data.mission.states).length).toBe(6);
    });

    it('should fail with invalid YAML syntax', () => {
      const result = loadMissionFromYaml('invalid: yaml: [');
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should fail with missing required fields', () => {
      const yaml = `
mission:
  id: 123
  title: 
  states:
    idle:
      image: 
      auto_advance: "not-a-boolean"
`;

      const result = loadMissionFromYaml(yaml);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should fail with missing states', () => {
      const yaml = `
mission:
  id: test
  title: Test
  states:
    idle:
      image: /test.jpg
    calling:
      image: /calling.jpg
`;

      const result = loadMissionFromYaml(yaml);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle sound fields correctly', () => {
      const yaml = `
mission:
  id: sound-test
  title: Sound Test
  states:
    idle:
      image: /images/test.jpg
      sound_floor: /audio/loop.mp3
      sound_random:
        - /audio/sound1.mp3
        - /audio/sound2.mp3
      auto_advance: false
    calling:
      image: /images/calling.jpg
      sound_sequence:
        - /audio/seq1.mp3
        - /audio/seq2.mp3
      auto_advance: true
      duration_ms: 5000
    alerting:
      image: /images/alerting.jpg
    deploying:
      image: /images/deploying.jpg
    arriving:
      image: /images/arriving.jpg
    returning:
      image: /images/returning.jpg
`;

      const result = loadMissionFromYaml(yaml);
      
      expect(result.success).toBe(true);
      expect(result.data.mission.states.idle.sound_floor).toBe('/audio/loop.mp3');
      expect(Array.isArray(result.data.mission.states.idle.sound_random)).toBe(true);
      expect(Array.isArray(result.data.mission.states.calling.sound_sequence)).toBe(true);
    });
  });

  describe('formatValidationErrors', () => {
    it('should format errors correctly', () => {
      const errors = [
        { field: 'id', message: 'Mission ID must be a non-empty string', value: '' },
        { field: 'states.idle.image', message: 'State image must be a non-empty string', value: null }
      ];
      
      const formatted = formatValidationErrors(errors);
      
      expect(formatted).toContain('❌ Mission ID must be a non-empty string');
      expect(formatted).toContain('❌ State image must be a non-empty string');
    });
  });
});
