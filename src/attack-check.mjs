// The student changes this check as each stage adds an attack to the same app.
// Never return tokens, private keys, real names, or note bodies.
export async function runAttackChecks(config) {
  if (config.step !== 1) throw new Error('이 단계의 공격 점검을 src/attack-check.mjs에 구현해 주세요.');
  if (typeof config.publicAppUrl !== 'string' || !config.publicAppUrl.startsWith('https://')
      || config.publicAppUrl.includes('.example')) throw new Error('aleph.config.json의 실제 배포 주소를 먼저 넣어 주세요.');
  if (typeof config.sampleMarker !== 'string' || !config.sampleMarker) throw new Error('가상 메모의 확인 표시를 넣어 주세요.');
  const response = await fetch(config.publicAppUrl, { redirect: 'error', signal: AbortSignal.timeout(10000) });
  const body = await response.text();
  const visible = response.ok && body.includes(config.sampleMarker);
  return [{ attackId: 'anonymous_note_read', expected: '비로그인 화면에서 가상 메모를 확인',
    observed: visible ? '시크릿 요청에서 가상 메모 확인 표시가 보임' : `시크릿 요청에서 확인 표시가 보이지 않음 (HTTP ${response.status})` }];
}
