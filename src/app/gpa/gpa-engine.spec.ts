import {cumulativeGpa, evaluateDegree, evaluateLevel, semesterGpa, toPoints} from './gpa-engine';
import {intakeDef} from './handbook';

/**
 * Real-world check against an official BIT "Student Record of Examinations" sheet
 * (anonymised: only course codes, grades and the published status are kept).
 * The student started Level I in 2021 (2022/2023 course list) and was awarded DIT in 2022.
 * Where a course was repeated, the latest attempt is used.
 */
describe('Official result sheet (anonymised sample)', () => {
  // Level I, latest attempts. EN1106 was F in 2021 and P in 2022.
  const level1 = {
    im: 'Pass',   // EN1106 P [2022]
    is: 'C+',     // IT1106
    cs: 'B',      // IT1206
    pc: 'B-',     // IT1306
    ip: 'B+',     // IT1406
    csk1: 'Pass', // EN2106
    mc: 'B',      // IT2106
    se: 'C',      // IT2206
    ds: 'C+',     // IT2306
    web1: 'A-',   // IT2406
  };
  // Level II, latest attempts. IT3206 C- -> C, IT4106 D -> C.
  const level2 = {
    csk2: 'Pass', // EN3106
    ooad: 'C',    // IT3106
    dsa: 'C',     // IT3206 [2024]
    dms: 'C',     // IT3306
    web2: 'A',    // IT3406
    uxd: 'C',     // IT4106 [2024]
    ead: 'B-',    // IT4206
    pm: 'C',      // IT4306
    asd: 'C',     // IT4406
    cn: 'C',      // IT4506
  };
  // Level III, latest attempts ([2025] where repeated).
  const level3 = {
    fme: 'Pass',  // EN5106 F -> P
    sdp: 'A',     // IT5106
    pp: 'D',      // IT5206 D -> D
    pis: 'D+',    // IT5306 D -> D+
    sana: 'C+',   // IT5406 C- -> C+
    mc2: 'E',     // IT5506 E -> E (optional)
    etit: 'Pass', // EN6106
    qa: 'C-',     // IT6206 D+ -> C-
    mad: 'D+',    // IT6306 E -> D+
    nsa: 'E',     // IT6406 D -> E
    bt: 'D+',     // IT6506 D -> D+ (optional)
  };

  ['2022', '2023'].forEach(intake => describe(`with the ${intake} rules`, () => {
    it('Level I: GPA 2.78 and meets the progression rules (sheet: DIT awarded)', () => {
      const r = evaluateLevel(intake, 1, level1);
      expect(r.gpa).toBe(2.78); // 83.5 / 30
      expect(r.cCredits).toBe(30);
      expect(r.canProgress).toBeTrue();
    });

    it('Level I semester GPAs', () => {
      const p = toPoints(level1);
      expect(semesterGpa(intake, 1, p)).toBe(2.83); // (9.2 + 12 + 8.1 + 13.2) / 15
      expect(semesterGpa(intake, 2, p)).toBe(2.73); // (9 + 8 + 9.2 + 14.8) / 15
    });

    it('Level II: GPA 2.36, every course at C or above', () => {
      const r = evaluateLevel(intake, 2, level2);
      expect(r.gpa).toBe(2.36); // 70.8 / 30
      expect(r.cCredits).toBe(30);
      expect(r.canProgress).toBeTrue();
    });

    it('Level III: counts IT6506 (D+) rather than IT5506 (E) as the optional', () => {
      const r = evaluateLevel(intake, 3, level3);
      expect(r.gpa).toBe(2); // (32 + 3 + 3.9 + 6.9 + 5.1 + 5.2 + 0 + 3.9) / 30
      expect(r.cCredits).toBe(11); // only IT5106 (8) and IT5406 (3)
      expect(r.belowD.map(c => c.code)).toEqual(['IT6406']);
      expect(r.canProgress).toBeFalse();
    });

    it('degree is not awarded (sheet: BIT status blank)', () => {
      const d = evaluateDegree(intake, [level1, level2, level3]);
      expect(d.gpa).toBe(2.38); // 214.3 / 90
      expect(d.meetsGpa).toBeTrue();
      expect(d.meetsCredits).toBeTrue();
      expect(d.sdpOk).toBeTrue();
      expect(d.enPassed).toBeTrue();
      expect(d.meetsCCredits).toBeFalse(); // Level III has 11 C credits, needs 20
      expect(d.noBelowD).toBeFalse();      // IT6406 E
      expect(d.graduated).toBeFalse();
    });
  }));

  it('first attempts only: EN1106 F blocks Level I progression', () => {
    const r = evaluateLevel('2022', 1, {...level1, im: 'Fail'});
    expect(r.gpa).toBe(2.78); // EN courses are non-GPA
    expect(r.enPassed).toBeFalse();
    expect(r.canProgress).toBeFalse();
  });

  it('course codes and GPA credits match the sheet', () => {
    const credits: { [code: string]: number } = {
      IT1106: 4, IT1206: 4, IT1306: 3, IT1406: 4, IT2106: 3, IT2206: 4, IT2306: 4, IT2406: 4,
      IT3106: 3, IT3206: 3, IT3306: 3, IT3406: 4, IT4106: 3, IT4206: 4, IT4306: 3, IT4406: 4, IT4506: 3,
      IT5106: 8, IT5206: 3, IT5306: 3, IT5406: 3, IT5506: 3, IT6206: 3, IT6306: 4, IT6406: 3, IT6506: 3,
    };
    const all = intakeDef('2022').levels.flatMap(l => l.courses).filter(c => c.kind !== 'en');
    expect(all.map(c => c.code).sort()).toEqual(Object.keys(credits).sort());
    all.forEach(c => expect(c.credits).withContext(c.code).toBe(credits[c.code]));
    const en = intakeDef('2022').levels.flatMap(l => l.courses).filter(c => c.kind === 'en').map(c => c.code).sort();
    expect(en).toEqual(['EN1106', 'EN2106', 'EN3106', 'EN5106', 'EN6106']);
  });

  it('cumulative GPA over Levels I and II is 2.57', () => {
    expect(cumulativeGpa('2023', [toPoints(level1), toPoints(level2)]).gpa).toBe(2.57); // 154.3 / 60
  });
});
