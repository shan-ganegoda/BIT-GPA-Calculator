import {FormBuilder} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {HomeComponent} from './home.component';
import {DatatransferService} from '../../Services/datatransfer.service';
import {BAD, colourFor, GOOD, letterFor, WARN} from '../progressionpage/progressionpage.component';

/**
 * Unit tests for the GPA maths in HomeComponent (year 1/2/3 GPA and cumulative GPA).
 * The component is built directly (no template) with a spy MatDialog.
 */
describe('HomeComponent GPA calculation', () => {
  let component: HomeComponent;
  let dialog: jasmine.SpyObj<MatDialog>;
  let dt: jasmine.SpyObj<DatatransferService>;

  const Y1 = ['is', 'ip', 'cs', 'pc', 'ds', 'web1', 'mc', 'se'];
  const Y2 = ['dsa', 'dms', 'ooad', 'web2', 'ead', 'asd', 'uxd', 'pm', 'cn'];
  const Y3 = ['pp', 'sdp', 'pis', 'sana', 'mad', 'nsa', 'bt', 'qa'];

  function fill(group: any, subjects: string[], grade: string) {
    const v: any = {};
    subjects.forEach(s => v[s] = grade);
    group.patchValue(v);
  }

  function passEn() {
    component.yearone.patchValue({im: 'Pass', csk1: 'Pass'});
    component.yeartwo.patchValue({csk2: 'Pass'});
    component.yearthree.patchValue({fme: 'Pass', etit: 'Pass'});
  }

  beforeEach(() => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    dt = jasmine.createSpyObj('DatatransferService', ['setIntake', 'setY1Data', 'setY2Data', 'setY3Data']);
    component = new HomeComponent(new FormBuilder(), dialog, dt);
    spyOn(console, 'log'); // calculatey1gpa logs grades
  });

  describe('getValue (grade -> points)', () => {
    const table: [string, number][] = [
      ['A+', 4], ['A', 4], ['A-', 3.7], ['B+', 3.3], ['B', 3], ['B-', 2.7],
      ['C+', 2.3], ['C', 2], ['C-', 1.7], ['D+', 1.3], ['D', 1], ['E', 0], ['null', 0],
    ];
    table.forEach(([g, p]) => it(`maps ${g} to ${p}`, () => expect(component.getValue(g)).toBe(p)));

    it('returns undefined for an unknown grade', () => {
      expect(component.getValue('Z')).toBeUndefined();
    });
  });

  describe('Year 1 GPA (30 credits)', () => {
    it('is 4.00 for all A', () => {
      fill(component.yearone, Y1, 'A');
      component.calculatey1gpa(false);
      expect(component.datum.gpa).toBe(4);
    });

    it('is 0 when nothing is selected', () => {
      component.calculatey1gpa(false);
      expect(component.datum.gpa).toBe(0);
    });

    it('weights by credit: only IS (4 cr) = A, rest E -> 16/30 = 0.53', () => {
      fill(component.yearone, Y1, 'E');
      component.yearone.patchValue({is: 'A'});
      component.calculatey1gpa(false);
      expect(component.datum.gpa).toBe(0.53);
    });

    it('weights by credit: only PC (3 cr) = A -> 12/30 = 0.4', () => {
      fill(component.yearone, Y1, 'E');
      component.yearone.patchValue({pc: 'A'});
      component.calculatey1gpa(false);
      expect(component.datum.gpa).toBe(0.4);
    });

    it('rounds to 2 decimals (all B+ = 3.3)', () => {
      fill(component.yearone, Y1, 'B+');
      component.calculatey1gpa(false);
      expect(component.datum.gpa).toBe(3.3);
    });

    it('counts 30 credits when every subject is C or above', () => {
      fill(component.yearone, Y1, 'C');
      component.calculatey1gpa(false);
      expect(component.datas.y1credit).toBe(30);
    });

    it('does not count D grades towards credits', () => {
      fill(component.yearone, Y1, 'D');
      component.calculatey1gpa(false);
      expect(component.datas.y1credit).toBe(0);
    });

    it('allows progression with C across the board and EN subjects passed', () => {
      fill(component.yearone, Y1, 'C');
      component.yearone.patchValue({im: 'Pass', csk1: 'Pass'});
      component.calculatey1gpa(false);
      expect(component.datum.condition1).toBe('Yes');
      expect(component.datum.condition2).toBe('Yes');
      expect(component.datum.condition3).toBe('Yes');
      expect(component.datum.condition4).toBe('No');
      expect(component.datum.prmsg).toContain('Congratulations');
    });

    it('blocks progression when GPA < 2.00', () => {
      fill(component.yearone, Y1, 'C-');
      component.yearone.patchValue({im: 'Pass', csk1: 'Pass'});
      component.calculatey1gpa(false);
      expect(component.datum.condition1).toBe('No');
      expect(component.datum.prmsg).toContain("can't move on");
    });

    it('blocks progression when an EN subject is not passed', () => {
      fill(component.yearone, Y1, 'A');
      component.yearone.patchValue({im: 'Pass', csk1: 'Fail'});
      component.calculatey1gpa(false);
      expect(component.datum.condition3).toBe('NO');
      expect(component.datum.prmsg).toContain("can't move on");
    });

    it('blocks progression when any subject is E even with a high GPA', () => {
      fill(component.yearone, Y1, 'A');
      component.yearone.patchValue({im: 'Pass', csk1: 'Pass', mc: 'E'});
      component.calculatey1gpa(false);
      expect(component.datum.condition4).toBe('Yes');
      expect(component.datum.prmsg).toContain("can't move on");
    });

    it('opens the dialog only when asked', () => {
      component.calculatey1gpa(false);
      expect(dialog.open).not.toHaveBeenCalled();
      component.calculatey1gpa(true);
      expect(dialog.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('Year 2 GPA (30 credits)', () => {
    it('is 4.00 for all A', () => {
      fill(component.yeartwo, Y2, 'A');
      component.calculatey2gpa(false);
      expect(component.datum.gpa).toBe(4);
    });

    it('weights WEB-2 (4 cr): only WEB-2 = A -> 16/30 = 0.53', () => {
      fill(component.yeartwo, Y2, 'E');
      component.yeartwo.patchValue({web2: 'A'});
      component.calculatey2gpa(false);
      expect(component.datum.gpa).toBe(0.53);
    });

    it('weights DSA (3 cr): only DSA = A -> 12/30 = 0.4', () => {
      fill(component.yeartwo, Y2, 'E');
      component.yeartwo.patchValue({dsa: 'A'});
      component.calculatey2gpa(false);
      expect(component.datum.gpa).toBe(0.4);
    });

    it('counts 30 credits when all are C or above', () => {
      fill(component.yeartwo, Y2, 'C');
      component.calculatey2gpa(false);
      expect(component.year2values.y2credit).toBe(30);
    });

    it('allows progression with all C and csk2 passed', () => {
      fill(component.yeartwo, Y2, 'C');
      component.yeartwo.patchValue({csk2: 'Pass'});
      component.calculatey2gpa(false);
      expect(component.datum.prmsg).toContain('You can move on to');
      expect(component.datum.prmsg).not.toContain("can't");
    });

    it('blocks progression when csk2 is not passed', () => {
      fill(component.yeartwo, Y2, 'A');
      component.calculatey2gpa(false);
      expect(component.datum.condition3).toBe('NO');
      expect(component.datum.prmsg).toContain("can't move on");
    });
  });

  describe('Year 3 GPA (30 credits)', () => {
    it('is 4.00 for all A', () => {
      fill(component.yearthree, Y3, 'A');
      component.calculatey3gpa(false);
      expect(component.datum.gpa).toBe(4);
    });

    it('weights SDP (8 cr): only SDP = A -> 32/30 = 1.07', () => {
      fill(component.yearthree, Y3, 'E');
      component.yearthree.patchValue({sdp: 'A'});
      component.calculatey3gpa(false);
      expect(component.datum.gpa).toBe(1.07);
    });

    it('counts 30 credits when all are C or above', () => {
      fill(component.yearthree, Y3, 'C');
      component.calculatey3gpa(false);
      expect(component.year3values.y3credit).toBe(30);
    });

    it('completes year 3 with all C and fme/etit passed', () => {
      fill(component.yearthree, Y3, 'C');
      component.yearthree.patchValue({fme: 'Pass', etit: 'Pass'});
      component.calculatey3gpa(false);
      expect(component.datum.prmsg).toContain('completed Year 3');
    });

    it('fails year 3 when fme is not passed', () => {
      fill(component.yearthree, Y3, 'A');
      component.yearthree.patchValue({fme: 'Fail', etit: 'Pass'});
      component.calculatey3gpa(false);
      expect(component.datum.prmsg).toContain('Not yet');
    });
  });

  describe('Data hand-off to DatatransferService', () => {
    it('sendY1Data stores year 1 results', () => {
      fill(component.yearone, Y1, 'A');
      component.sendY1Data();
      expect(dt.setY1Data).toHaveBeenCalledWith(jasmine.objectContaining({y1gpa: 4, y1credit: 30}));
    });

    it('sendY3Data stores year 1, 2 and 3 results', () => {
      fill(component.yearone, Y1, 'A');
      fill(component.yeartwo, Y2, 'B');
      fill(component.yearthree, Y3, 'C');
      component.sendY3Data();
      expect(dt.setY1Data).toHaveBeenCalledWith(jasmine.objectContaining({y1gpa: 4}));
      expect(dt.setY2Data).toHaveBeenCalledWith(jasmine.objectContaining({y2gpa: 3}));
      expect(dt.setY3Data).toHaveBeenCalledWith(jasmine.objectContaining({y3gpa: 2}));
    });
  });

  describe('Cumulative (overall) GPA', () => {
    function overall() {
      component.overollgpacalculate();
      return (dialog.open.calls.mostRecent().args[1] as any).data.message;
    }

    it('is 4.00 and graduates when every grade is A and all EN subjects passed', () => {
      fill(component.yearone, Y1, 'A');
      fill(component.yeartwo, Y2, 'A');
      fill(component.yearthree, Y3, 'A');
      passEn();
      const m = overall();
      expect(m.gpa).toBe(4);
      expect(m.condition2).toBe('Yes'); // 90 credits
      expect(m.prmsg).toContain('Congratulations');
    });

    it('does not graduate when an EN subject is not passed', () => {
      fill(component.yearone, Y1, 'A');
      fill(component.yeartwo, Y2, 'A');
      fill(component.yearthree, Y3, 'A');
      passEn();
      component.yearthree.patchValue({etit: 'Fail'});
      const m = overall();
      expect(m.condition3).toBe('No');
      expect(m.prmsg).toContain('Not yet');
    });

    it('does not graduate when any subject is E (below D)', () => {
      fill(component.yearone, Y1, 'A');
      fill(component.yeartwo, Y2, 'A');
      fill(component.yearthree, Y3, 'A');
      passEn();
      component.yeartwo.patchValue({cn: 'E'});
      const m = overall();
      expect(m.condition2).toBe('Yes'); // 90 GPA credits still have a grade
      expect(m.condition4).toBe('Yes');
      expect(m.prmsg).toContain('Not yet');
    });

    it('does not graduate while a course has no grade', () => {
      fill(component.yearone, Y1, 'A');
      fill(component.yeartwo, Y2, 'A');
      fill(component.yearthree, Y3, 'A');
      passEn();
      component.yeartwo.patchValue({cn: null});
      const m = overall();
      expect(m.condition2).toBe('No');
      expect(m.prmsg).toContain('Not yet');
    });

    it('does not graduate when GPA < 2.00', () => {
      fill(component.yearone, Y1, 'C-');
      fill(component.yeartwo, Y2, 'C-');
      fill(component.yearthree, Y3, 'C-');
      passEn();
      const m = overall();
      expect(m.gpa).toBeLessThan(2);
      expect(m.condition1).toBe('No');
    });

    it('opens the Degree Status dialog', () => {
      overall();
      expect((dialog.open.calls.mostRecent().args[1] as any).data.heading).toBe('Degree Status');
    });

    // Handbook: cumulative GPA is credit-weighted over all 90 GPA credits. A/B/C -> (4 + 3 + 2) / 3 = 3.00.
    it('cumulative GPA = credit-weighted over 90 credits (A/B/C -> 3.00)', () => {
      fill(component.yearone, Y1, 'A');
      fill(component.yeartwo, Y2, 'B');
      fill(component.yearthree, Y3, 'C');
      passEn();
      expect(overall().gpa).toBe(3);
    });
  });

  /**
   * Degree award rules, identical in the 2022-2026 handbooks
   * (see /handbook-rules-2022-2026.md): >= 90 GPA credits with >= 30 per level, cumulative GPA >= 2.00,
   * >= 20 credits at C or above per level, >= C in the Software Development Project (sdp),
   * all EN passed, no grade below D.
   */
  describe('Degree award rules (handbooks 2022-2026)', () => {
    function allA() {
      fill(component.yearone, Y1, 'A');
      fill(component.yeartwo, Y2, 'A');
      fill(component.yearthree, Y3, 'A');
      passEn();
    }
    function award() {
      component.overollgpacalculate();
      return (dialog.open.calls.mostRecent().args[1] as any).data.message.prmsg as string;
    }

    it('still graduates with one D (1.00) when GPA >= 2.00 and each level has >= 20 C credits', () => {
      allA();
      component.yeartwo.patchValue({cn: 'D'});
      expect(award()).toContain('Congratulations');
    });

    it('does not graduate when the Software Development Project is below C', () => {
      allA();
      component.yearthree.patchValue({sdp: 'D'});
      expect(award()).toContain('Not yet');
    });

    it('graduates when the Software Development Project is exactly C', () => {
      allA();
      component.yearthree.patchValue({sdp: 'C'});
      expect(award()).toContain('Congratulations');
    });

    it('does not graduate with an E (below D) anywhere', () => {
      allA();
      component.yearone.patchValue({is: 'E'});
      expect(award()).toContain('Not yet');
    });

    it('does not graduate when a level has fewer than 20 credits at C or above', () => {
      allA();
      fill(component.yeartwo, Y2, 'D'); // level 2: 0 C-credits, overall GPA still 3.00
      expect(award()).toContain('Not yet');
    });

    it('does not graduate when any EN course is not passed', () => {
      allA();
      component.yearone.patchValue({im: 'Fail'});
      expect(award()).toContain('Not yet');
    });
  });

  /**
   * Per-intake-year handbook data. The app has no intake-year selector yet, so the data is
   * checked for internal consistency and the year-specific behaviour is left pending.
   */
  describe('Handbook data per intake year', () => {
    const level1: {[intake: string]: {sem1: number; sem2: number; total: number}} = {
      '2022': {sem1: 15, sem2: 15, total: 30},
      '2023': {sem1: 15, sem2: 15, total: 30},
      '2024': {sem1: 16, sem2: 15, total: 31}, // EN1106 replaced by 1-credit IT1506
      '2025': {sem1: 16, sem2: 15, total: 31},
      '2026': {sem1: 13, sem2: 18, total: 31}, // new syllabus IT1107..IT2507
    };
    Object.keys(level1).forEach(y =>
      it(`Level I credits for ${y} add up`, () => expect(level1[y].sem1 + level1[y].sem2).toBe(level1[y].total)));

    it('Level II credits add up (13 + 17 = 30)', () => expect(13 + 17).toBe(30));

    it('Level III credits add up: 13 (sem 5) + 14 (sem 6) compulsory + one 3-credit optional = 30', () => {
      expect(13 + 14 + 3).toBe(30);
    });

    it('2022 intake: Level progression needs GPA >= 1.50 (later intakes 2.00)', () => {
      fill(component.yearone, Y1, 'C-'); // 1.70
      component.yearone.patchValue({im: 'Pass', csk1: 'Pass'});
      component.setIntake('2022');
      component.calculatey1gpa(false);
      expect(component.datum.condition1).toBe('Yes');
      component.setIntake('2023');
      component.calculatey1gpa(false);
      expect(component.datum.condition1).toBe('No');
    });

    it('2022 intake: GPA 1.50 to 1.99 with 20 C credits and no E can progress', () => {
      component.setIntake('2022');
      // C on IS, CS, IP, SE, DB, WEB-1 (24 credits) and D on FOSS, MC (6 credits) -> (48 + 6) / 30 = 1.80
      fill(component.yearone, ['is', 'cs', 'ip', 'se', 'ds', 'web1'], 'C');
      fill(component.yearone, ['pc', 'mc'], 'D');
      component.yearone.patchValue({im: 'Pass', csk1: 'Pass'});
      component.calculatey1gpa(false);
      expect(component.datum.gpa).toBe(1.8);
      expect(component.datum.prmsg).toContain('Congratulations');
    });

    it('2024/2025 intakes: Level I includes IT1506 (1 credit) and totals 31 credits', () => {
      ['2024', '2025'].forEach(y => {
        component.setIntake(y as any);
        component.yearone.reset();
        fill(component.yearone, Y1, 'A');
        component.yearone.patchValue({csk1: 'Pass', fm: 'E'});
        component.calculatey1gpa(false);
        expect(component.datum.gpa).toBe(3.87); // 120 / 31
        expect(component.datum.condition4).toBe('Yes'); // E in IT1506
        component.yearone.patchValue({fm: 'A'});
        component.calculatey1gpa(false);
        expect(component.datum.gpa).toBe(4);
        expect(component.datum.condition3).toBe('Yes'); // EN1106 no longer exists
        expect(component.datum.prmsg).toContain('Congratulations');
      });
    });

    it('2024 intake: Level I is incomplete without an IT1506 grade', () => {
      component.setIntake('2024');
      fill(component.yearone, Y1, 'A');
      component.yearone.patchValue({csk1: 'Pass'});
      component.calculatey1gpa(false);
      expect(component.datum.gpa).toBe(4);
      expect(component.datum.missing.join()).toContain('IT1506');
      expect(component.datum.prmsg).toContain("can't move on");
    });

    it('2026 intake: Level I uses the new IT1107-IT2507 course list (13 + 18 credits)', () => {
      const Y1_2026 = ['fit', 'cs7', 'os7', 'fp7', 'oosd', 'se7', 'db7', 'wad7', 'mc7'];
      component.setIntake('2026');
      fill(component.yearone, Y1_2026, 'A');
      component.yearone.patchValue({en1107: 'Pass'});
      component.calculatey1gpa(false);
      expect(component.datum.gpa).toBe(4);
      expect(component.datum.prmsg).toContain('Congratulations');

      fill(component.yearone, Y1_2026, 'E');
      component.yearone.patchValue({os7: 'A'});
      component.calculatey1gpa(false);
      expect(component.datum.gpa).toBe(0.52); // 16 / 31
    });

    it('a 2026 course list ignores grades left over from the old Level I courses', () => {
      fill(component.yearone, Y1, 'A');
      component.setIntake('2026');
      component.calculatey1gpa(false);
      expect(component.datum.gpa).toBe(0);
    });
  });

  describe('Level III optional course', () => {
    it('counts IT5506 instead of IT6506 when only IT5506 is graded', () => {
      fill(component.yearthree, Y3.filter(k => k !== 'bt'), 'A');
      component.yearthree.patchValue({mc2: 'C', fme: 'Pass', etit: 'Pass'});
      component.calculatey3gpa(false);
      expect(component.datum.gpa).toBe(3.8); // (27 x 4 + 3 x 2) / 30
      expect(component.datum.missing.length).toBe(0);
    });

    it('counts only the better optional when both are graded', () => {
      fill(component.yearthree, Y3, 'A');
      component.yearthree.patchValue({mc2: 'E'});
      component.calculatey3gpa(false);
      expect(component.datum.gpa).toBe(4);
      expect(component.datum.condition4).toBe('No');
    });

    it('reports Level III as incomplete with no optional course', () => {
      fill(component.yearthree, Y3.filter(k => k !== 'bt'), 'A');
      component.yearthree.patchValue({fme: 'Pass', etit: 'Pass'});
      component.calculatey3gpa(false);
      expect(component.datum.gpa).toBe(4);
      expect(component.datum.prmsg).toContain('Not yet');
    });
  });

  describe('Courses with no grade', () => {
    it('are left out of the GPA instead of counting as 0', () => {
      component.yearone.patchValue({is: 'A', pc: 'B'}); // (16 + 9) / 7
      component.calculatey1gpa(false);
      expect(component.datum.gpa).toBe(3.57);
      expect(component.datum.prmsg).toContain("can't move on");
    });
  });
});

/**
 * DatatransferService: semester and running cumulative GPA.
 * Handbook semester GPA credits: S1 15, S2 15, S3 13, S4 17, S5 16 (incl. 3-credit optional), S6 17.
 */
describe('DatatransferService semester and running GPA', () => {
  let svc: DatatransferService;
  const y1 = (g: number) => ({y1credit: 30, y1gpa: g, is: g, ip: g, cs: g, pc: g, se: g, ds: g, mc: g, web1: g});
  const y2 = (g: number) => ({y2credit: 30, y2gpa: g, dsa: g, dms: g, ooad: g, web2: g, ead: g, asd: g, pm: g, uxd: g, cn: g});
  const y3 = (g: number) => ({y3credit: 30, y3gpa: g, pp: g, sdp: g, pis: g, sana: g, mad: g, nsa: g, bt: g, qa: g});

  beforeEach(() => svc = new DatatransferService());

  it('Semester 1 and 2 GPA are 4.00 for all A', () => {
    svc.setY1Data(y1(4));
    expect(svc.sem1gpa).toBe(4);
    expect(svc.sem2gpa).toBe(4);
  });

  it('Semester 3 GPA is 4.00 for all A (13 credits)', () => {
    svc.setY1Data(y1(4));
    svc.setY2Data(y2(4));
    expect(svc.sem3gpa).toBe(4);
  });

  it('Semester 4 GPA is 4.00 for all A (17 credits)', () => {
    svc.setY1Data(y1(4));
    svc.setY2Data(y2(4));
    expect(svc.sem4gpa).toBe(4);
  });

  it('Semester 5 and 6 GPA are 4.00 for all A; project credits split 4/4', () => {
    svc.setY1Data(y1(4));
    svc.setY2Data(y2(4));
    svc.setY3Data(y3(4));
    expect(svc.sem5gpa).toBe(4);
    expect(svc.sem6gpa).toBe(4);
  });

  it('detects semester 5 when only semester 5 grades are entered', () => {
    svc.setY1Data(y1(4));
    svc.setY2Data(y2(4));
    svc.setY3Data({...y3(4), mad: 0, nsa: 0, bt: 0, qa: 0});
    expect(svc.semester).toBe('5');
  });

  it('detects semester 1 when only semester 1 grades are entered', () => {
    svc.setY1Data({...y1(4), se: 0, ds: 0, mc: 0, web1: 0});
    expect(svc.semester).toBe('1');
  });

  it('running cumulative GPA after year 2 is the mean of both years (A, B -> 3.5)', () => {
    svc.setY1Data(y1(4));
    svc.setY2Data(y2(3));
    expect(svc.overallgpa).toBe('3.5');
  });

  it('running cumulative GPA after year 3 (A, B, C -> 3)', () => {
    svc.setY1Data(y1(4));
    svc.setY2Data(y2(3));
    svc.setY3Data(y3(2));
    expect(svc.overallgpa).toBe('3');
  });

  it('accumulates credit counts across years', () => {
    svc.setY1Data(y1(4));
    svc.setY2Data(y2(4));
    svc.setY3Data(y3(4));
    expect(Number(svc.creditcount)).toBe(90);
  });

  it('semester 5 GPA includes IT5506 when it is the chosen optional', () => {
    svc.setY1Data(y1(4));
    svc.setY2Data(y2(4));
    svc.setY3Data({...y3(4), bt: null, mc2: 2});
    expect(svc.sem5gpa).toBe(3.63); // (13 x 4 + 3 x 2) / 16
    expect(svc.sem6gpa).toBe(4);
  });

  it('semester GPA leaves out courses with no grade', () => {
    svc.setY1Data({...y1(4), cs: null, pc: 2}); // IS 16 + IP 16 + FOSS 6 = 38 over 11 credits
    expect(svc.sem1gpa).toBe(3.45);
  });

  it('running cumulative GPA is credit-weighted (2024 intake, 31 + 30 credits)', () => {
    svc.setIntake('2024');
    svc.setY1Data({...y1(4), fm: 0});
    svc.setY2Data(y2(3));
    expect(svc.overallgpa).toBe('3.44'); // (0 + 120 + 90) / 61
    expect(svc.sem1gpa).toBe(3.75); // 60 / 16
  });

  it('starting again from year 1 clears later years', () => {
    svc.setY1Data(y1(4));
    svc.setY2Data(y2(4));
    svc.setY1Data(y1(3));
    expect(svc.levelSet).toEqual([true, false, false]);
    expect(svc.overallgpa).toBe('3');
  });
});

/**
 * Progress report after a reload: rebuilt from the grades saved on this device.
 */
describe('DatatransferService.loadSaved', () => {
  const KEY = 'bit-gpa-calculator.v2';
  let before: string | null;

  beforeEach(() => before = localStorage.getItem(KEY));
  afterEach(() => before === null ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, before));

  it('returns false when nothing is saved', () => {
    localStorage.removeItem(KEY);
    expect(new DatatransferService().loadSaved()).toBeFalse();
  });

  it('sends every year up to the last one with a grade, with the saved intake', () => {
    localStorage.setItem(KEY, JSON.stringify({
      intake: '2024',
      levels: [{is: 'A', cs: 'B'}, {dsa: 'C'}, {}],
    }));
    const svc = new DatatransferService();
    expect(svc.loadSaved()).toBeTrue();
    expect(svc.intake).toBe('2024');
    expect(svc.levelSet).toEqual([true, true, false]);
    expect(svc.levelPoints[0]['is']).toBe(4);
    expect(svc.levelPoints[0]['ip']).toBeNull();
    expect(svc.levelGpa[1]).toBe(2);
  });

  it('ignores unreadable saved data', () => {
    localStorage.setItem(KEY, '{not json');
    expect(new DatatransferService().loadSaved()).toBeFalse();
  });
});

describe('Progress report chart helpers', () => {
  it('turns grade points back into letters', () => {
    expect(letterFor(4)).toBe('A');
    expect(letterFor(3.3)).toBe('B+');
    expect(letterFor(1.7)).toBe('C-');
    expect(letterFor(0)).toBe('E');
  });

  it('colours C and above, C- to D, and E differently', () => {
    expect(colourFor(2)).toBe(GOOD);
    expect(colourFor(1.7)).toBe(WARN);
    expect(colourFor(1)).toBe(WARN);
    expect(colourFor(0)).toBe(BAD);
  });
});

describe('Level dialog names the courses that fail a rule', () => {
  it('shows the course name and grade for a grade below D', () => {
    const c = new HomeComponent(new FormBuilder(), jasmine.createSpyObj('MatDialog', ['open']),
      jasmine.createSpyObj('DatatransferService', ['setIntake']));
    c.yeartwo.patchValue({dsa: 'E'});
    c.calculatey2gpa(false);
    const check = c.datum.checks.find((k: any) => k.label === 'No grade below D');
    expect(check.detail).toBe('Data Structures and Algorithms (E)');
    expect(c.datum.prmsg).toContain('Enter grades for the 8 missing courses first');
  });
});
