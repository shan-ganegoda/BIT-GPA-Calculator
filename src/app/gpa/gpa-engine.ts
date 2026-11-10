/**
 * GPA and progression rules from the BIT handbooks 2022 to 2026.
 *
 * GPA = sum(grade point x GPA credits) / GPA credits, over the compulsory courses plus the required
 * optional course(s), rounded to 2 decimals. Courses with no grade yet are left out of the average
 * (so a partly finished level shows the GPA so far), but the level is then reported as incomplete.
 */
import {
  Course, EN_GRADES, GRADE_POINTS, Intake, intakeDef, LevelDef, MIN_C_CREDITS_PER_LEVEL, MIN_DEGREE_GPA,
  NOT_SELECTED, SDP_KEY,
} from './handbook';

/** Grade point per course key; null or undefined = no grade yet. */
export type Points = { [key: string]: number | null | undefined };
/** Raw select values per course key ('A', 'B+', 'Pass', 'null', ...). */
export type Grades = { [key: string]: string | null | undefined };

export interface Check {
  label: string;
  ok: boolean;
  detail?: string;
}

export interface LevelResult {
  level: 1 | 2 | 3;
  gpa: number;
  /** GPA credits that have a grade. */
  gradedCredits: number;
  /** GPA credits the level needs (compulsory + required optional). */
  requiredCredits: number;
  /** GPA credits at C (2.00) or above. */
  cCredits: number;
  minGpa: number;
  meetsGpa: boolean;
  meetsCCredits: boolean;
  enPassed: boolean;
  /** Courses graded E (below D). */
  belowD: Course[];
  /** GPA courses (or the optional choice) with no grade yet. */
  missing: string[];
  /** EN courses that are not passed or not entered. */
  enNotPassed: Course[];
  complete: boolean;
  canProgress: boolean;
  checks: Check[];
}

export interface DegreeResult {
  gpa: number;
  levels: LevelResult[];
  totalCredits: number;
  meetsGpa: boolean;
  meetsCredits: boolean;
  meetsCCredits: boolean;
  sdpOk: boolean;
  enPassed: boolean;
  noBelowD: boolean;
  graduated: boolean;
  checks: Check[];
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Grade point for a grade, null when nothing is selected, undefined for an unknown value. */
export function gradePoint(grade: string | null | undefined): number | null | undefined {
  if (grade === null || grade === undefined || grade === '' || grade === NOT_SELECTED) {
    return null;
  }
  return grade in GRADE_POINTS ? GRADE_POINTS[grade] : undefined;
}

export function toPoints(grades: Grades): Points {
  const p: Points = {};
  Object.keys(grades).forEach(k => {
    const v = gradePoint(grades[k]);
    p[k] = v === undefined ? null : v;
  });
  return p;
}

const graded = (p: Points, key: string) => typeof p[key] === 'number' && !isNaN(p[key] as number);

/**
 * The GPA courses that count for a level: every compulsory course plus the best graded optional
 * course(s). Extra optional courses are ignored (handbook rule).
 */
export function countedCourses(level: LevelDef, p: Points): { courses: Course[]; optionalMissing: number } {
  const compulsory = level.courses.filter(c => c.kind === 'gpa');
  const optionals = level.courses
    .filter(c => c.kind === 'optional' && graded(p, c.key))
    .sort((a, b) => (p[b.key] as number) - (p[a.key] as number));
  const chosen = optionals.slice(0, level.optionalToCount);
  return {courses: [...compulsory, ...chosen], optionalMissing: level.optionalToCount - chosen.length};
}

function requiredCredits(level: LevelDef): number {
  const compulsory = level.courses.filter(c => c.kind === 'gpa').reduce((s, c) => s + c.credits, 0);
  const optional = level.courses.filter(c => c.kind === 'optional').map(c => c.credits).sort((a, b) => a - b);
  return compulsory + optional.slice(0, level.optionalToCount).reduce((s, c) => s + c, 0);
}

function weighted(courses: Course[], p: Points, credits: (c: Course) => number) {
  let sum = 0;
  let cr = 0;
  courses.forEach(c => {
    const w = credits(c);
    if (w > 0 && graded(p, c.key)) {
      sum += (p[c.key] as number) * w;
      cr += w;
    }
  });
  return {sum, credits: cr, gpa: cr > 0 ? round2(sum / cr) : 0};
}

/** GPA of one level from grade points (no grade = left out). */
export function levelGpa(intake: Intake | string, levelNo: 1 | 2 | 3, p: Points) {
  const level = intakeDef(intake).levels[levelNo - 1];
  return weighted(countedCourses(level, p).courses, p, c => c.credits);
}

/** GPA of one semester (1..6). The Software Development Project counts 4 credits in each of semesters 5 and 6. */
export function semesterGpa(intake: Intake | string, semester: number, p: Points): number {
  const levelNo = Math.ceil(semester / 2) as 1 | 2 | 3;
  const level = intakeDef(intake).levels[levelNo - 1];
  const share = (c: Course) => c.split ? (c.split[semester] ?? 0) : (c.semester === semester ? c.credits : 0);
  return weighted(countedCourses(level, p).courses, p, share).gpa;
}

/** Cumulative GPA over all levels, credit-weighted. */
export function cumulativeGpa(intake: Intake | string, levelPoints: Points[]): { gpa: number; credits: number } {
  let sum = 0;
  let credits = 0;
  intakeDef(intake).levels.forEach((level, i) => {
    const p = levelPoints[i] ?? {};
    const w = weighted(countedCourses(level, p).courses, p, c => c.credits);
    sum += w.sum;
    credits += w.credits;
  });
  return {gpa: credits > 0 ? round2(sum / credits) : 0, credits};
}

/** Progression check for one level (Level I to II, II to III; Level III uses the same checks). */
export function evaluateLevel(intake: Intake | string, levelNo: 1 | 2 | 3, grades: Grades): LevelResult {
  const def = intakeDef(intake);
  const level = def.levels[levelNo - 1];
  const p = toPoints(grades);
  const {courses, optionalMissing} = countedCourses(level, p);
  const w = weighted(courses, p, c => c.credits);

  const cCredits = courses.filter(c => graded(p, c.key) && (p[c.key] as number) >= 2).reduce((s, c) => s + c.credits, 0);
  const belowD = courses.filter(c => graded(p, c.key) && (p[c.key] as number) < 1);
  const missing = courses.filter(c => !graded(p, c.key)).map(c => `${c.code} ${c.name}`);
  if (optionalMissing > 0) {
    missing.push(level.courses.filter(c => c.kind === 'optional').map(c => c.code).join(' or ') + ' (optional course)');
  }
  const enNotPassed = level.courses.filter(c => c.kind === 'en' && grades[c.key] !== EN_GRADES[0]);

  const meetsGpa = w.gpa >= def.minLevelGpa;
  const meetsCCredits = cCredits >= MIN_C_CREDITS_PER_LEVEL;
  const enPassed = enNotPassed.length === 0;
  const complete = missing.length === 0;
  const canProgress = meetsGpa && meetsCCredits && enPassed && belowD.length === 0 && complete;

  const checks: Check[] = [
    {label: `Level GPA of at least ${def.minLevelGpa.toFixed(2)}`, ok: meetsGpa, detail: w.gpa.toFixed(2)},
    {label: `At least ${MIN_C_CREDITS_PER_LEVEL} GPA credits at C or above`, ok: meetsCCredits, detail: `${cCredits} credits`},
    {label: 'PASS in every enhancement (EN) course', ok: enPassed,
      detail: enPassed ? undefined : enNotPassed.map(c => c.code).join(', ')},
    {label: 'No grade below D', ok: belowD.length === 0,
      detail: belowD.length ? belowD.map(c => c.code).join(', ') : undefined},
    {label: 'A grade entered for every course', ok: complete,
      detail: complete ? undefined : `${missing.length} missing`},
  ];

  return {
    level: levelNo, gpa: w.gpa, gradedCredits: w.credits, requiredCredits: requiredCredits(level), cCredits,
    minGpa: def.minLevelGpa, meetsGpa, meetsCCredits, enPassed, belowD, missing, enNotPassed, complete,
    canProgress, checks,
  };
}

/** Degree award check. */
export function evaluateDegree(intake: Intake | string, levelGrades: [Grades, Grades, Grades]): DegreeResult {
  const levels = levelGrades.map((g, i) => evaluateLevel(intake, (i + 1) as 1 | 2 | 3, g));
  const cum = cumulativeGpa(intake, levelGrades.map(toPoints));
  const sdp = gradePoint(levelGrades[2][SDP_KEY]);

  const meetsGpa = cum.gpa >= MIN_DEGREE_GPA;
  const meetsCredits = cum.credits >= 90 && levels.every(l => l.gradedCredits >= 30 && l.complete);
  const meetsCCredits = levels.every(l => l.meetsCCredits);
  const sdpOk = typeof sdp === 'number' && sdp >= 2;
  const enPassed = levels.every(l => l.enPassed);
  const noBelowD = levels.every(l => l.belowD.length === 0);
  const graduated = meetsGpa && meetsCredits && meetsCCredits && sdpOk && enPassed && noBelowD;

  const checks: Check[] = [
    {label: `Cumulative GPA of at least ${MIN_DEGREE_GPA.toFixed(2)}`, ok: meetsGpa, detail: cum.gpa.toFixed(2)},
    {label: 'At least 90 GPA credits, with 30 or more from each level', ok: meetsCredits,
      detail: levels.map(l => `L${l.level}: ${l.gradedCredits}`).join(' · ')},
    {label: 'At least 20 credits at C or above in each level', ok: meetsCCredits,
      detail: levels.map(l => `L${l.level}: ${l.cCredits}`).join(' · ')},
    {label: 'At least C in the Software Development Project (IT5106)', ok: sdpOk},
    {label: 'PASS in every enhancement (EN) course', ok: enPassed},
    {label: 'No grade below D in any course', ok: noBelowD},
  ];

  return {gpa: cum.gpa, levels, totalCredits: cum.credits, meetsGpa, meetsCredits, meetsCCredits, sdpOk, enPassed,
    noBelowD, graduated, checks};
}
