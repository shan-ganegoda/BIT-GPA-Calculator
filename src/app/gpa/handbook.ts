/**
 * BIT course and rule data, taken from the UCSC BIT student handbooks 2022 to 2026
 * (https://www.bit.lk/download/handbook/<year>-handbook.pdf).
 *
 * Every course has a form key (the FormControl name used by the calculator), its handbook code,
 * the semester it is taught in and its GPA credits. Enhancement (EN) courses are non-GPA: they are
 * graded Pass / Fail and only have to be passed.
 */

export type Intake = '2022' | '2023' | '2024' | '2025' | '2026';

export type CourseKind = 'gpa' | 'en' | 'optional';

export interface Course {
  /** FormControl name. */
  key: string;
  /** Handbook course code, e.g. IT1106. */
  code: string;
  name: string;
  /** Short label used on charts. */
  short: string;
  /** GPA credits (0 for EN courses). */
  credits: number;
  /** Semester 1..6. For a course split across two semesters this is the first one. */
  semester: number;
  kind: CourseKind;
  /** Credits per semester for a course that runs over two semesters (the Software Development Project). */
  split?: { [semester: number]: number };
}

export interface LevelDef {
  level: 1 | 2 | 3;
  semesters: [number, number];
  courses: Course[];
  /** How many 'optional' courses count towards the GPA. */
  optionalToCount: number;
}

export interface IntakeDef {
  intake: Intake;
  label: string;
  /** Minimum level GPA to progress (Level I to II, Level II to III). */
  minLevelGpa: number;
  levels: [LevelDef, LevelDef, LevelDef];
  notes: string[];
}

/** Grade points, identical in all five handbooks. */
export const GRADE_POINTS: { [grade: string]: number } = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'E': 0.0,
};

export const GRADES: string[] = Object.keys(GRADE_POINTS);
export const EN_GRADES: string[] = ['Pass', 'Fail'];

/** Value of a select that has no grade yet. */
export const NOT_SELECTED = 'null';

export const MIN_C_CREDITS_PER_LEVEL = 20;
export const MIN_DEGREE_GPA = 2.0;
export const SDP_KEY = 'sdp';

const gpa = (key: string, code: string, name: string, short: string, credits: number, semester: number): Course =>
  ({key, code, name, short, credits, semester, kind: 'gpa'});
const en = (key: string, code: string, name: string, semester: number): Course =>
  ({key, code, name, short: code, credits: 0, semester, kind: 'en'});

/* ---------------- Level I ---------------- */

const LEVEL1_2022: LevelDef = {
  level: 1, semesters: [1, 2], optionalToCount: 0,
  courses: [
    en('im', 'EN1106', 'Introductory Mathematics', 1),
    gpa('is', 'IT1106', 'Information Systems', 'IS', 4, 1),
    gpa('cs', 'IT1206', 'Computer Systems', 'CS', 4, 1),
    gpa('pc', 'IT1306', 'Free and Open Source Software for Personal Computing', 'FOSS', 3, 1),
    gpa('ip', 'IT1406', 'Introduction to Programming', 'IP', 4, 1),
    en('csk1', 'EN2106', 'Communication Skills I', 2),
    gpa('mc', 'IT2106', 'Mathematics for Computing I', 'MC', 3, 2),
    gpa('se', 'IT2206', 'Fundamentals of Software Engineering', 'SE', 4, 2),
    gpa('ds', 'IT2306', 'Database Systems', 'DB', 4, 2),
    gpa('web1', 'IT2406', 'Web Application Development I', 'WEB-1', 4, 2),
  ],
};

/** 2024 and 2025: EN1106 is replaced by the 1-credit GPA course IT1506. */
const LEVEL1_2024: LevelDef = {
  ...LEVEL1_2022,
  courses: [
    gpa('fm', 'IT1506', 'Fundamentals of Mathematics', 'FM', 1, 1),
    ...LEVEL1_2022.courses.filter(c => c.key !== 'im'),
  ],
};

/** 2026/27 syllabus. */
const LEVEL1_2026: LevelDef = {
  level: 1, semesters: [1, 2], optionalToCount: 0,
  courses: [
    en('en1107', 'EN1107', 'Enhancement Course (EN1107)', 1),
    gpa('fit', 'IT1107', 'Fundamentals of IT Systems', 'FIT', 3, 1),
    gpa('cs7', 'IT1207', 'Computer Systems', 'CS', 3, 1),
    gpa('os7', 'IT1307', 'Operating System Concepts', 'OS', 4, 1),
    gpa('fp7', 'IT1407', 'Fundamentals of Programming', 'FP', 3, 1),
    gpa('oosd', 'IT2107', 'Object Oriented Software Modeling and Development', 'OOSD', 3, 2),
    gpa('se7', 'IT2207', 'Software Engineering', 'SE', 4, 2),
    gpa('db7', 'IT2307', 'Database Systems', 'DB', 4, 2),
    gpa('wad7', 'IT2407', 'Web Application Development', 'WAD', 4, 2),
    gpa('mc7', 'IT2507', 'Mathematics for Computing', 'MC', 3, 2),
  ],
};

/* ---------------- Level II (same for all intakes 2022 to 2026) ---------------- */

const LEVEL2: LevelDef = {
  level: 2, semesters: [3, 4], optionalToCount: 0,
  courses: [
    en('csk2', 'EN3106', 'Communication Skills II', 3),
    gpa('ooad', 'IT3106', 'Object Oriented Analysis and Design', 'OOAD', 3, 3),
    gpa('dsa', 'IT3206', 'Data Structures and Algorithms', 'DSA', 3, 3),
    gpa('dms', 'IT3306', 'Data Management Systems', 'DMS', 3, 3),
    gpa('web2', 'IT3406', 'Web Application Development II', 'WEB-2', 4, 3),
    gpa('uxd', 'IT4106', 'User Experience Design', 'UXD', 3, 4),
    gpa('ead', 'IT4206', 'Enterprise Application Development', 'EAD', 4, 4),
    gpa('pm', 'IT4306', 'Information Technology Project Management', 'PM', 3, 4),
    gpa('asd', 'IT4406', 'Agile Software Development', 'ASD', 4, 4),
    gpa('cn', 'IT4506', 'Computer Networks', 'CN', 3, 4),
  ],
};

/* ---------------- Level III (same for all intakes 2022 to 2026) ---------------- */

const LEVEL3: LevelDef = {
  level: 3, semesters: [5, 6], optionalToCount: 1,
  courses: [
    en('fme', 'EN5106', 'Fundamentals of Management and Entrepreneurship', 5),
    {key: SDP_KEY, code: 'IT5106', name: 'Software Development Project', short: 'SDP', credits: 8, semester: 5,
      kind: 'gpa', split: {5: 4, 6: 4}},
    gpa('pp', 'IT5206', 'Professional Practice', 'PP', 3, 5),
    gpa('pis', 'IT5306', 'Principles of Information Security', 'PIS', 3, 5),
    gpa('sana', 'IT5406', 'Systems and Network Administration', 'SANA', 3, 5),
    {key: 'mc2', code: 'IT5506', name: 'Mathematics for Computing II', short: 'MC2', credits: 3,
      semester: 5, kind: 'optional'},
    en('etit', 'EN6106', 'Emerging Topics in Information Technology', 6),
    gpa('qa', 'IT6206', 'Software Quality Assurance', 'SQA', 3, 6),
    gpa('mad', 'IT6306', 'Mobile Application Development', 'MAD', 4, 6),
    gpa('nsa', 'IT6406', 'Network Security and Audit', 'NSA', 3, 6),
    {key: 'bt', code: 'IT6506', name: 'e-Business Technologies', short: 'EBT', credits: 3,
      semester: 6, kind: 'optional'},
  ],
};

const COMMON_NOTES = [
  'Choose one of the two optional Level III courses (IT5506 or IT6506). If you enter both, the better grade is counted.',
];

export const INTAKES: IntakeDef[] = [
  {
    intake: '2022', label: '2022 intake', minLevelGpa: 1.5,
    levels: [LEVEL1_2022, LEVEL2, LEVEL3],
    notes: ['2022 handbook: a level GPA of 1.50 is enough to progress, and all online assignments must be passed.',
      ...COMMON_NOTES],
  },
  {
    intake: '2023', label: '2023 intake', minLevelGpa: 2.0,
    levels: [LEVEL1_2022, LEVEL2, LEVEL3],
    notes: COMMON_NOTES,
  },
  {
    intake: '2024', label: '2024 intake', minLevelGpa: 2.0,
    levels: [LEVEL1_2024, LEVEL2, LEVEL3],
    notes: ['From 2024, EN1106 is replaced by IT1506 Fundamentals of Mathematics (1 GPA credit).', ...COMMON_NOTES],
  },
  {
    intake: '2025', label: '2025 intake', minLevelGpa: 2.0,
    levels: [LEVEL1_2024, LEVEL2, LEVEL3],
    notes: ['From 2024, EN1106 is replaced by IT1506 Fundamentals of Mathematics (1 GPA credit).', ...COMMON_NOTES],
  },
  {
    intake: '2026', label: '2026/27 intake', minLevelGpa: 2.0,
    levels: [LEVEL1_2026, LEVEL2, LEVEL3],
    notes: ['2026/27 uses the new Level I syllabus (IT1107 to IT2507). Levels II and III here follow the current syllabus.',
      ...COMMON_NOTES],
  },
];

export const DEFAULT_INTAKE: Intake = '2023';

export function intakeDef(intake: Intake | string): IntakeDef {
  return INTAKES.find(i => i.intake === intake) ?? INTAKES.find(i => i.intake === DEFAULT_INTAKE)!;
}

/** Every form key used by a level, across all intakes (so one FormGroup serves every intake). */
export function allKeysForLevel(level: 1 | 2 | 3): string[] {
  const keys = new Set<string>();
  INTAKES.forEach(i => i.levels[level - 1].courses.forEach(c => keys.add(c.key)));
  return Array.from(keys);
}
