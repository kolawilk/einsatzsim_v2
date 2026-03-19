'use client';

import { useState, useEffect } from 'react';
import { loadMissionFromYaml, loadMissionFromUrl, formatValidationErrors } from '@/lib/missions';
import { MissionLoadResult, LoadedMission } from '@/types/mission';

const sampleValidYaml = `mission:
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

const sampleInvalidYaml = `mission:
  id: 123
  title: 
  states:
    idle:
      image: 
      auto_advance: "not-a-boolean"
`;

const sampleMalformedYaml = `mission:
  id: test
  title: Test
  states:
    idle:
      image: /test.jpg
    calling:
      image: /calling.jpg
    # missing states
`;

const sampleMalformedSyntax = `invalid: yaml: [`;

export default function TestMissionLoader() {
  const [results, setResults] = useState<{ name: string; result: MissionLoadResult }[]>([]);
  const [loadedMissions, setLoadedMissions] = useState<LoadedMission[]>([]);
  const [urlMissionResult, setUrlMissionResult] = useState<MissionLoadResult | null>(null);

  useEffect(() => {
    // Test valid YAML
    const validResult = loadMissionFromYaml(sampleValidYaml, 'test-valid');
    
    // Test invalid YAML (validation errors)
    const invalidResult = loadMissionFromYaml(sampleInvalidYaml, 'test-invalid');
    
    // Test malformed YAML (missing states)
    const malformedResult = loadMissionFromYaml(sampleMalformedYaml, 'test-malformed');
    
    // Test malformed YAML syntax
    const syntaxErrorResult = loadMissionFromYaml(sampleMalformedSyntax, 'test-syntax-error');

    setResults([
      { name: '✅ Valid Mission', result: validResult },
      { name: '❌ Invalid Mission (Validation Errors)', result: invalidResult },
      { name: '❌ Malformed Mission (Missing States)', result: malformedResult },
      { name: '❌ Syntax Error', result: syntaxErrorResult },
    ]);

    // Collect successful missions
    const successful: LoadedMission[] = [];
    if (validResult.success) successful.push(validResult.data);
    setLoadedMissions(successful);

    // Test loading from URL
    loadMissionFromUrl('/missions/brand-in-wohnhaus.yaml').then(setUrlMissionResult);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-red-600">🚒 YAML Mission Loader Test</h1>
      
      <div className="space-y-6">
        {results.map(({ name, result }) => (
          <div key={name} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{name}</h2>
            
            {result.success ? (
              <div className="space-y-2">
                <div className="text-green-600 font-medium">✅ Mission loaded successfully</div>
                <div className="text-sm text-zinc-600">
                  <strong>ID:</strong> {result.data.mission.id}
                </div>
                <div className="text-sm text-zinc-600">
                  <strong>Title:</strong> {result.data.mission.title}
                </div>
                <div className="text-sm text-zinc-600">
                  <strong>Source:</strong> {result.data.source}
                </div>
                <div className="text-sm text-zinc-600">
                  <strong>States:</strong> {Object.keys(result.data.mission.states).join(', ')}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-red-600 font-medium">❌ Mission failed to load</div>
                <div className="bg-red-50 p-4 rounded text-sm font-mono whitespace-pre-wrap">
                  {formatValidationErrors(result.errors)}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* URL Loading Test */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🌐 URL Mission Loading</h2>
          {urlMissionResult ? (
            urlMissionResult.success ? (
              <div className="space-y-2">
                <div className="text-green-600 font-medium">✅ Mission loaded from URL</div>
                <div className="text-sm text-zinc-600">
                  <strong>ID:</strong> {urlMissionResult.data.mission.id}
                </div>
                <div className="text-sm text-zinc-600">
                  <strong>Title:</strong> {urlMissionResult.data.mission.title}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-red-600 font-medium">❌ Failed to load from URL</div>
                <div className="bg-red-50 p-4 rounded text-sm font-mono whitespace-pre-wrap">
                  {formatValidationErrors(urlMissionResult.errors)}
                </div>
              </div>
            )
          ) : (
            <div className="text-zinc-500">Loading from URL...</div>
          )}
        </div>
      </div>

      {loadedMissions.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📋 Loaded Mission Details</h2>
          <pre className="bg-zinc-100 p-4 rounded text-sm overflow-auto max-h-96">
            {JSON.stringify(loadedMissions[0], null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
