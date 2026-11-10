import {Injectable} from '@angular/core';
import {DEFAULT_INTAKE, Intake, intakeDef} from '../gpa/handbook';
import {cumulativeGpa, evaluateLevel, Grades, Points, round2, semesterGpa, toPoints} from '../gpa/gpa-engine';

/** Where the calculator saves the grades on this device. */
export const GRADES_STORAGE_KEY = 'bit-gpa-calculator.v2';

/**
 * Hands the calculator results to the progression page.
 * setY1Data / setY2Data / setY3Data take the level's GPA, its credit count (credits at C or above)
 * and the grade point of every course (null = no grade).
 */
@Injectable({
  providedIn: 'root'
})
export class DatatransferService {

  intake: Intake = DEFAULT_INTAKE;

  /** Grade points per level (index 0 = Level I). */
  levelPoints: Points[] = [{}, {}, {}];
  /** Which levels have been sent. */
  levelSet: boolean[] = [false, false, false];
  levelGpa: number[] = [0, 0, 0];
  levelCredits: number[] = [0, 0, 0];

  /*============= Overall Data ==============*/

  overallgpa: string = '';
  semester: string = '';
  creditcount: string = '';
  year: string = '';

  /*============= Semester GPAs ==============*/

  year1gpa: string = '';
  sem1gpa = 0;
  sem2gpa = 0;

  year2gpa: string = '';
  sem3gpa = 0;
  sem4gpa = 0;

  year3gpa: string = '';
  sem5gpa = 0;
  sem6gpa = 0;

  setIntake(intake: Intake) {
    if (intake !== this.intake) {
      this.intake = intake;
      this.reset();
    }
  }

  reset() {
    this.levelPoints = [{}, {}, {}];
    this.levelSet = [false, false, false];
    this.levelGpa = [0, 0, 0];
    this.levelCredits = [0, 0, 0];
    this.overallgpa = this.semester = this.creditcount = this.year = '';
    this.year1gpa = this.year2gpa = this.year3gpa = '';
    this.sem1gpa = this.sem2gpa = this.sem3gpa = this.sem4gpa = this.sem5gpa = this.sem6gpa = 0;
  }

  setY1Data(datas: any) {
    this.reset();
    this.store(1, datas, datas.y1gpa, datas.y1credit);
    this.year1gpa = String(datas.y1gpa);
    this.sem1gpa = semesterGpa(this.intake, 1, this.levelPoints[0]);
    this.sem2gpa = semesterGpa(this.intake, 2, this.levelPoints[0]);
  }

  setY2Data(datas: any) {
    this.store(2, datas, datas.y2gpa, datas.y2credit);
    this.year2gpa = String(datas.y2gpa);
    this.sem3gpa = semesterGpa(this.intake, 3, this.levelPoints[1]);
    this.sem4gpa = semesterGpa(this.intake, 4, this.levelPoints[1]);
  }

  setY3Data(datas: any) {
    this.store(3, datas, datas.y3gpa, datas.y3credit);
    this.year3gpa = String(datas.y3gpa);
    this.sem5gpa = semesterGpa(this.intake, 5, this.levelPoints[2]);
    this.sem6gpa = semesterGpa(this.intake, 6, this.levelPoints[2]);
  }

  /**
   * Rebuilds the results from the grades saved on this device, so the progress report also works
   * after a reload or when opened directly. Sends every year up to the last one with a grade.
   * Returns false when nothing is saved.
   */
  loadSaved(): boolean {
    let saved: { intake?: string; levels?: Grades[] } | null = null;
    try {
      saved = JSON.parse(localStorage.getItem(GRADES_STORAGE_KEY) ?? 'null');
    } catch (e) {
      return false;
    }
    if (!saved) {
      return false;
    }
    this.intake = intakeDef(saved.intake ?? DEFAULT_INTAKE).intake;
    this.reset();
    const levels = (saved.levels ?? []).slice(0, 3);
    const entered = (g?: Grades) => !!g && Object.values(g).some(v => v !== null && v !== undefined && v !== 'null');
    let last = -1;
    levels.forEach((g, i) => { if (entered(g)) { last = i; } });
    const setters = [(d: any) => this.setY1Data(d), (d: any) => this.setY2Data(d), (d: any) => this.setY3Data(d)];
    for (let i = 0; i <= last; i++) {
      const g = levels[i] ?? {};
      const r = evaluateLevel(this.intake, (i + 1) as 1 | 2 | 3, g);
      setters[i]({...toPoints(g), [`y${i + 1}gpa`]: r.gpa, [`y${i + 1}credit`]: r.cCredits});
    }
    return last >= 0;
  }

  /** Semester GPAs 1..6 (0 when that level has not been sent). */
  semesterGpas(): number[] {
    return [this.sem1gpa, this.sem2gpa, this.sem3gpa, this.sem4gpa, this.sem5gpa, this.sem6gpa];
  }

  private store(levelNo: 1 | 2 | 3, datas: any, gpa: number, credits: number) {
    const level = intakeDef(this.intake).levels[levelNo - 1];
    const p: Points = {};
    level.courses.filter(c => c.kind !== 'en').forEach(c => {
      const v = datas[c.key];
      p[c.key] = typeof v === 'number' ? v : null;
    });
    const i = levelNo - 1;
    this.levelPoints[i] = p;
    this.levelSet[i] = true;
    this.levelGpa[i] = round2(Number(gpa) || 0);
    this.levelCredits[i] = Number(credits) || 0;

    this.year = String(levelNo);
    this.creditcount = String(this.levelCredits.slice(0, levelNo).reduce((s, c) => s + c, 0));
    this.overallgpa = String(cumulativeGpa(this.intake, this.levelPoints.slice(0, levelNo)).gpa);

    // Current semester: the second semester of the level once any course taught only there has a grade.
    const [first, second] = level.semesters;
    const secondStarted = level.courses.some(c => c.kind !== 'en' && !c.split && c.semester === second && Number(p[c.key]) > 0);
    this.semester = String(secondStarted ? second : first);
  }
}
