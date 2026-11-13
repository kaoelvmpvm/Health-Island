// Health Island v0.6 — single source of truth for prototype unlock rules.
// The codes are fixed values already displayed by the separate public games.
// These are classroom activity gates, NOT secure identity/proof-of-completion.
export const MAX_STAGE=5;
export const ISLAND_UNLOCK_STAGE=Object.freeze({
  '不炫耀':1,
  '不染色':4,
  '不迷路':Number.POSITIVE_INFINITY
});
export const TOWER_UNLOCK_STAGE=Object.freeze({
  '1-2':1,
  '2-2':2,
  '3-2':3,
  '1-1':4,
  '2-1':5,
  '3-1':Number.POSITIVE_INFINITY,
  '1-3':Number.POSITIVE_INFINITY,
  '2-3':Number.POSITIVE_INFINITY,
  '3-3':Number.POSITIVE_INFINITY
});
export const PASSCODE_GATES=Object.freeze({
  1:Object.freeze({
    lessonId:'1-2',code:'2499',nextStage:2,
    nextDescription:'不炫耀島的 2-2 情意塔',
    title:'1-2 認知塔 → 2-2 情意塔',
    codeLabel:'青春密碼'
  }),
  2:Object.freeze({
    lessonId:'2-2',code:'172',nextStage:3,
    nextDescription:'不炫耀島的 3-2 技能塔',
    title:'2-2 情意塔 → 3-2 技能塔',
    codeLabel:'通關密碼'
  }),
  3:Object.freeze({
    lessonId:'3-2',code:'7034',nextStage:4,
    nextDescription:'不染色島及其 1-1 認知塔',
    title:'3-2 技能塔 → 不染色島',
    codeLabel:'成功通關密碼'
  }),
  4:Object.freeze({
    lessonId:'1-1',code:'8704',nextStage:5,
    nextDescription:'不染色島的 2-1 情意塔',
    title:'1-1 認知塔 → 2-1 情意塔',
    codeLabel:'青春密碼'
  })
});
export function isIslandUnlocked(topic,stage){
  return stage>= (ISLAND_UNLOCK_STAGE[topic]??Number.POSITIVE_INFINITY);
}
export function isTowerUnlocked(id,stage){
  return stage>= (TOWER_UNLOCK_STAGE[id]??Number.POSITIVE_INFINITY);
}
export function normalizeActivityCode(value){
  return String(value??'')
    .trim()
    .replace(/[０-９]/g,letter=>String(letter.charCodeAt(0)-65296))
    .replace(/\s+/g,'');
}
export function verifyActivityCode(stage,code){
  const gate=PASSCODE_GATES[stage];
  return !!gate && normalizeActivityCode(code)===gate.code;
}
