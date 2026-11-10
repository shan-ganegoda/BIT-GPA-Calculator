import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {DecimalPipe, NgClass} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {MessageComponent} from "../../util/dialog/message/message.component";
import {FinalmessageComponent} from "../../util/dialog/finalmessage/finalmessage.component";
import {DatatransferService, GRADES_STORAGE_KEY} from "../../Services/datatransfer.service";
import {
  allKeysForLevel, Course, DEFAULT_INTAKE, EN_GRADES, GRADES, Intake, intakeDef, IntakeDef, INTAKES, LevelDef,
} from "../../gpa/handbook";
import {DegreeResult, evaluateDegree, evaluateLevel, gradePoint, Grades, LevelResult} from "../../gpa/gpa-engine";

type LevelNo = number;

const STORAGE_KEY = GRADES_STORAGE_KEY;
const ROMAN = ['I', 'II', 'III'];

@Component({
  selector: 'app-home',
  imports: [
    ReactiveFormsModule, RouterLink, DecimalPipe, NgClass,
    MatButtonModule, MatButtonToggleModule, MatCardModule, MatIconModule, MatSelectModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  readonly intakes = INTAKES;
  readonly roman = ROMAN;
  readonly thisYear = new Date().getFullYear();
  /** Wider than a phone: the "How this works" notes start open. */
  readonly wide = typeof window === 'undefined' || !window.matchMedia || window.matchMedia('(min-width: 769px)').matches;
  grades: string[] = GRADES;
  ens: string[] = EN_GRADES;

  intakeControl = new FormControl<Intake>(DEFAULT_INTAKE, {nonNullable: true});
  readonly intake = signal<Intake>(DEFAULT_INTAKE);

  yearone !: FormGroup;
  yeartwo !: FormGroup;
  yearthree !: FormGroup;

  /** Latest results, for the dialogs, the progression page and the tests. */
  datas: any;
  year2values: any;
  year3values: any;
  datum: any;

  /** Live results shown on the page as grades are picked. */
  readonly live = signal<LevelResult[]>([]);
  readonly liveDegree = signal<DegreeResult>(evaluateDegree(DEFAULT_INTAKE, [{}, {}, {}]));

  private subs: Subscription[] = [];

  constructor(private fb: FormBuilder,
              private dg: MatDialog,
              private dt: DatatransferService) {
    this.yearone = this.buildGroup(1);
    this.yeartwo = this.buildGroup(2);
    this.yearthree = this.buildGroup(3);
    this.refreshLive();
  }

  ngOnInit() {
    this.restore();
    this.subs.push(
      this.intakeControl.valueChanges.subscribe(i => this.setIntake(i)),
      this.yearone.valueChanges.subscribe(() => this.onGradesChanged()),
      this.yeartwo.valueChanges.subscribe(() => this.onGradesChanged()),
      this.yearthree.valueChanges.subscribe(() => this.onGradesChanged()),
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  /* ---------------- Intake and course data ---------------- */

  get def(): IntakeDef {
    return intakeDef(this.intake());
  }

  level(levelNo: LevelNo): LevelDef {
    return this.def.levels[levelNo - 1];
  }

  coursesIn(levelNo: LevelNo, semester: number): Course[] {
    return this.level(levelNo).courses.filter(c => c.semester === semester);
  }

  group(levelNo: LevelNo): FormGroup {
    return [this.yearone, this.yeartwo, this.yearthree][levelNo - 1];
  }

  setIntake(intake: Intake) {
    this.intake.set(intake);
    this.dt.setIntake(intake);
    this.onGradesChanged();
  }

  creditsLabel(c: Course): string {
    if (c.kind === 'en') {
      return 'Non-GPA · Pass/Fail';
    }
    if (c.split) {
      return `${c.credits} credits (${Object.values(c.split).join(' + ')} over two semesters)`;
    }
    return `${c.credits} credit${c.credits === 1 ? '' : 's'}${c.kind === 'optional' ? ' · optional' : ''}`;
  }

  /** Colour hint for a picked grade. */
  gradeClass(levelNo: LevelNo, key: string): string {
    const v = this.group(levelNo).get(key)?.value;
    if (v === 'Pass') { return 'g-good'; }
    if (v === 'Fail') { return 'g-bad'; }
    const p = gradePoint(v);
    if (p === null || p === undefined) { return ''; }
    return p >= 2 ? 'g-good' : p >= 1 ? 'g-warn' : 'g-bad';
  }

  gradedCount(levelNo: LevelNo): number {
    const g = this.group(levelNo).getRawValue();
    return this.level(levelNo).courses.filter(c => g[c.key] !== null && g[c.key] !== 'null' && g[c.key] !== undefined).length;
  }

  clearLevel(levelNo: LevelNo) {
    this.group(levelNo).reset();
  }

  clearAll() {
    [1, 2, 3].forEach(l => this.clearLevel(l as LevelNo));
  }

  /* ---------------- Grade points ---------------- */

  /** Grade point of a grade ('null' / not selected = 0, unknown = undefined). */
  // @ts-ignore
  getValue(value: string) {
    const p = gradePoint(value);
    return p === null ? 0 : p;
  }

  /* ---------------- Level results ---------------- */

  calculatey1gpa(condition: boolean) {
    const r = this.evaluate(1);
    this.datas = {y1gpa: r.gpa, y1credit: r.cCredits, ...this.pointsOf(1)};
    this.datum = this.levelMessage(r);
    if (condition) {
      this.MessageDialog();
    }
  }

  calculatey2gpa(condition: boolean) {
    const r = this.evaluate(2);
    this.year2values = {y2gpa: r.gpa, y2credit: r.cCredits, ...this.pointsOf(2)};
    this.datum = this.levelMessage(r);
    if (condition) {
      this.MessageDialog();
    }
  }

  calculatey3gpa(condition: boolean) {
    const r = this.evaluate(3);
    this.year3values = {y3gpa: r.gpa, y3credit: r.cCredits, ...this.pointsOf(3)};
    this.datum = this.levelMessage(r);
    if (condition) {
      this.MessageDialog();
    }
  }

  calculate(levelNo: LevelNo) {
    [() => this.calculatey1gpa(true), () => this.calculatey2gpa(true), () => this.calculatey3gpa(true)][levelNo - 1]();
  }

  sendData(levelNo: LevelNo) {
    [() => this.sendY1Data(), () => this.sendY2Data(), () => this.sendY3Data()][levelNo - 1]();
  }

  MessageDialog() {
    this.dg.open(MessageComponent, {
      width: '520px',
      maxWidth: '95vw',
      data: {message: this.datum}
    });
  }

  sendY1Data() {
    this.dt.setIntake(this.intake());
    this.calculatey1gpa(false);
    this.dt.setY1Data(this.datas);
  }

  sendY2Data() {
    this.sendY1Data();
    this.calculatey2gpa(false);
    this.dt.setY2Data(this.year2values);
  }

  sendY3Data() {
    this.sendY2Data();
    this.calculatey3gpa(false);
    this.dt.setY3Data(this.year3values);
  }

  /* ---------------- Degree ---------------- */

  overollgpacalculate() {
    const d = this.evaluateAll();
    const yesNo = (b: boolean) => b ? 'Yes' : 'No';
    const datum = {
      gpa: d.gpa,
      condition1: yesNo(d.meetsGpa),
      condition2: yesNo(d.meetsCredits),
      condition3: yesNo(d.enPassed),
      condition4: yesNo(!d.noBelowD),
      checks: d.checks,
      missing: d.levels.reduce((n, l) => n + l.missing.length, 0),
      intake: this.def.label,
      graduated: d.graduated,
      prmsg: d.graduated
        ? 'Congratulations! You meet the requirements for the BIT degree.'
        : "Not yet. You don't meet all the degree requirements.",
    };

    this.dg.open(FinalmessageComponent, {
      width: '560px',
      maxWidth: '95vw',
      data: {heading: 'Degree Status', message: datum}
    });
  }

  /* ---------------- Helpers ---------------- */

  private buildGroup(levelNo: LevelNo): FormGroup {
    const controls: { [k: string]: FormControl } = {};
    allKeysForLevel(levelNo as 1 | 2 | 3).forEach(k => controls[k] = new FormControl(null));
    return this.fb.group(controls);
  }

  private gradesOf(levelNo: LevelNo): Grades {
    return this.group(levelNo).getRawValue();
  }

  private pointsOf(levelNo: LevelNo): { [k: string]: number | null } {
    const g = this.gradesOf(levelNo);
    const out: { [k: string]: number | null } = {};
    this.level(levelNo).courses.filter(c => c.kind !== 'en').forEach(c => {
      const p = gradePoint(g[c.key]);
      out[c.key] = typeof p === 'number' ? p : null;
    });
    return out;
  }

  private evaluate(levelNo: LevelNo): LevelResult {
    return evaluateLevel(this.intake(), levelNo as 1 | 2 | 3, this.gradesOf(levelNo));
  }

  private evaluateAll(): DegreeResult {
    return evaluateDegree(this.intake(), [this.gradesOf(1), this.gradesOf(2), this.gradesOf(3)]);
  }

  private levelMessage(r: LevelResult) {
    const next = r.level < 3 ? `Level ${ROMAN[r.level]}` : '';
    const nextYear = `Year ${r.level + 1} (${next})`;
    const toEnter = r.missing.length === 1 ? 'the 1 missing course' : `the ${r.missing.length} missing courses`;
    let prmsg: string;
    if (r.level < 3) {
      prmsg = r.canProgress
        ? `Congratulations! You can move on to ${nextYear}.`
        : r.complete ? `You can't move on to ${nextYear} yet. Check the conditions marked with a cross.`
          : `You can't move on to ${nextYear} yet. Enter grades for ${toEnter} first.`;
    } else {
      prmsg = r.canProgress
        ? 'Congratulations! You have completed Year 3 (Level III).'
        : r.complete ? 'Not yet. You need to retake the courses marked below.'
          : `Not yet. Enter grades for ${toEnter} first.`;
    }
    // Name the courses, not only their codes, and show the grade that caused the problem.
    const g = this.gradesOf(r.level as LevelNo);
    const named = (cs: Course[]) => cs.map(c => `${c.name} (${g[c.key] ?? 'no grade'})`).join(', ');
    const checks = r.checks.map(c => {
      if (c.label === 'No grade below D' && r.belowD.length) {
        return {...c, detail: named(r.belowD)};
      }
      if (c.label.startsWith('PASS in every enhancement') && r.enNotPassed.length) {
        return {...c, detail: named(r.enNotPassed)};
      }
      return c;
    });
    return {
      heading: `Year ${r.level} (Level ${ROMAN[r.level - 1]}) GPA Status`,
      gpa: r.gpa,
      condition1: r.meetsGpa ? 'Yes' : 'No',
      condition2: r.meetsCCredits ? 'Yes' : 'No',
      condition3: r.enPassed ? 'Yes' : 'NO',
      condition4: r.belowD.length ? 'Yes' : 'No',
      checks,
      missing: r.missing,
      ok: r.canProgress,
      intake: this.def.label,
      prmsg,
    };
  }

  private onGradesChanged() {
    this.refreshLive();
    this.save();
  }

  private refreshLive() {
    this.live.set([1, 2, 3].map(l => this.evaluate(l as LevelNo)));
    this.liveDegree.set(this.evaluateAll());
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        intake: this.intake(),
        levels: [this.gradesOf(1), this.gradesOf(2), this.gradesOf(3)],
      }));
    } catch (e) {
      // Storage can be blocked (private mode); the calculator still works without it.
    }
  }

  private restore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const saved = JSON.parse(raw);
      if (INTAKES.some(i => i.intake === saved.intake)) {
        this.intake.set(saved.intake);
        this.intakeControl.setValue(saved.intake, {emitEvent: false});
        this.dt.setIntake(saved.intake);
      }
      (saved.levels ?? []).forEach((g: Grades, i: number) => this.group((i + 1) as LevelNo).patchValue(g ?? {}, {emitEvent: false}));
      this.refreshLive();
    } catch (e) {
      // Ignore unreadable saved data.
    }
  }
}
