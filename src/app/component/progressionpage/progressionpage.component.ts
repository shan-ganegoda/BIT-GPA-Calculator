import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DecimalPipe} from '@angular/common';
import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import Chart from 'chart.js/auto';
import type {Plugin} from 'chart.js';
import {DatatransferService} from "../../Services/datatransfer.service";
import {Course, GRADE_POINTS, intakeDef} from "../../gpa/handbook";
import {countedCourses, Points} from "../../gpa/gpa-engine";

/** One bar on a chart. value null = no grade yet (the bar is left out, not drawn as a fail). */
export interface Bar {
  label: string;
  value: number;
  /** Text drawn above the bar: a grade letter or a GPA. */
  tag: string;
  /** Year or semester still has courses without a grade. */
  partial?: boolean;
  note?: string;
}

export interface LevelChart {
  level: number;
  title: string;
  bars: Bar[];
  notEntered: string[];
}

const ROMAN = ['I', 'II', 'III'];
/** Colour-blind-safe status colours on a white card (checked with the dataviz palette validator). */
export const GOOD = '#2563c9';
export const WARN = '#b87400';
export const BAD = '#b3261e';
const INK = '#14213d';
const MUTED = '#5b6b82';
const GRID = '#e6ecf4';

/** Grade letter for a grade point (A and A+ are both 4.0, shown as A). */
export function letterFor(points: number): string {
  if (points >= 4) {
    return 'A';
  }
  return Object.keys(GRADE_POINTS).find(g => GRADE_POINTS[g] === points) ?? points.toFixed(1);
}

export function colourFor(points: number): string {
  return points >= 2 ? GOOD : points >= 1 ? WARN : BAD;
}

/** Draws a dashed "needed to progress" line (explained in the chart caption) and the value tags above each bar. */
const decorations: Plugin<'bar'> = {
  id: 'gpaDecorations',
  afterDatasetsDraw(chart, _args, opts: any) {
    const {ctx, chartArea, scales} = chart;
    const meta = chart.getDatasetMeta(0);
    const tags: string[] = opts?.tags ?? [];
    ctx.save();
    ctx.font = '600 12px Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = INK;
    meta.data.forEach((bar: any, i: number) => {
      if (tags[i]) {
        ctx.fillText(tags[i], bar.x, bar.y - 6);
      }
    });
    if (typeof opts?.passLine === 'number') {
      const y = scales['y'].getPixelForValue(opts.passLine);
      ctx.strokeStyle = INK;
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(chartArea.left, y);
      ctx.lineTo(chartArea.right, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();
  },
};

@Component({
  imports: [RouterLink, MatButtonModule, MatIconModule, DecimalPipe],
  selector: 'app-progressionpage',
  templateUrl: './progressionpage.component.html',
  styleUrl: './progressionpage.component.css'
})
export class ProgressionpageComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('yearCanvas') yearCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('semCanvas') semCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('level1Canvas') level1Canvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('level2Canvas') level2Canvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('level3Canvas') level3Canvas?: ElementRef<HTMLCanvasElement>;

  readonly thisYear = new Date().getFullYear();
  readonly good = GOOD;
  readonly warn = WARN;
  readonly bad = BAD;

  hasData = false;
  intakeLabel = '';
  passGpa = 2;
  year = '0';
  semester = '0';
  credit = '0';
  gpalevel = '0';
  /** Some year shown still has courses without a grade. */
  partial = false;

  yearBars: Bar[] = [];
  semBars: Bar[] = [];
  levelCharts: LevelChart[] = [];

  private charts: Chart[] = [];

  constructor(private dt: DatatransferService) {
  }

  ngOnInit() {
    this.load();
  }

  ngAfterViewInit() {
    if (!this.hasData) {
      return;
    }
    this.barChart(this.yearCanvas, this.yearBars, this.passGpa, 'GPA');
    this.barChart(this.semCanvas, this.semBars, this.passGpa, 'GPA');
    const canvases = [this.level1Canvas, this.level2Canvas, this.level3Canvas];
    this.levelCharts.forEach(lc => this.barChart(canvases[lc.level - 1], lc.bars, undefined, 'Grade points'));
  }

  ngOnDestroy() {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  }

  /** Text alternative for a chart canvas. */
  describe(title: string, bars: Bar[]): string {
    if (!bars.length) {
      return `${title}: no grades yet.`;
    }
    return `${title}: ` + bars.map(b => `${b.label} ${b.tag}${b.partial ? ' (so far)' : ''}`).join(', ') + '.';
  }

  /**
   * Builds every array from scratch, so coming back to the page never duplicates data.
   * When the page is opened directly (reload, bookmark), the saved grades are used.
   */
  load() {
    const dt = this.dt;
    if (!dt.levelSet.some(Boolean)) {
      dt.loadSaved();
    }
    const def = intakeDef(dt.intake);
    const levelsSent = dt.levelSet.filter(Boolean).length;
    this.hasData = levelsSent > 0;
    this.intakeLabel = def.label;
    this.passGpa = def.minLevelGpa;
    if (!this.hasData) {
      return;
    }

    this.year = dt.year;
    this.semester = dt.semester;
    this.credit = dt.creditcount;
    this.gpalevel = Number(dt.overallgpa).toFixed(2);

    this.yearBars = [];
    this.semBars = [];
    this.levelCharts = [];
    this.partial = false;
    const sems = dt.semesterGpas();

    for (let i = 0; i < levelsSent; i++) {
      const level = def.levels[i];
      const points: Points = dt.levelPoints[i];
      const {courses, optionalMissing} = countedCourses(level, points);
      const graded = (c: Course) => typeof points[c.key] === 'number';
      const gradedCount = courses.filter(graded).length;
      const total = courses.length + optionalMissing;
      const partial = gradedCount < total;
      this.partial = this.partial || partial;

      if (gradedCount > 0) {
        this.yearBars.push({
          label: `Year ${i + 1}`, value: dt.levelGpa[i], tag: dt.levelGpa[i].toFixed(2), partial,
          note: partial ? `${gradedCount} of ${total} courses` : undefined,
        });
      }

      level.semesters.forEach((sem, j) => {
        const inSem = courses.filter(c => c.split ? c.split[sem] : c.semester === sem);
        const done = inSem.filter(graded).length;
        if (done === 0) {
          return; // no grades in this semester yet: leave it out instead of drawing a 0
        }
        const gpa = sems[2 * i + j];
        this.semBars.push({
          label: `Sem ${sem}`, value: gpa, tag: gpa.toFixed(2), partial: done < inSem.length,
          note: done < inSem.length ? `${done} of ${inSem.length} courses` : undefined,
        });
      });

      this.levelCharts.push({
        level: i + 1,
        title: `Year ${i + 1} (Level ${ROMAN[i]}) grades`,
        bars: courses.filter(graded).map(c => {
          const v = points[c.key] as number;
          return {label: c.short, value: v, tag: letterFor(v), note: c.name};
        }),
        notEntered: courses.filter(c => !graded(c)).map(c => c.short),
      });
    }
  }

  private barChart(ref: ElementRef<HTMLCanvasElement> | undefined, bars: Bar[], passLine: number | undefined,
                   yTitle: string) {
    if (!ref || !bars.length) {
      return;
    }
    const colours = bars.map(b => colourFor(b.value));
    this.charts.push(new Chart(ref.nativeElement, {
      type: 'bar',
      data: {
        labels: bars.map(b => b.label),
        datasets: [{
          data: bars.map(b => b.value),
          backgroundColor: bars.map((b, i) => b.partial ? colours[i] + '66' : colours[i]),
          borderColor: colours,
          borderWidth: bars.map(b => b.partial ? 2 : 0),
          borderRadius: 4,
          borderSkipped: 'bottom',
          minBarLength: 4,
          maxBarThickness: 56,
        }],
      },
      plugins: [decorations],
      options: {
        maintainAspectRatio: false,
        responsive: true,
        layout: {padding: {top: 18}},
        plugins: {
          legend: {display: false},
          title: {display: false},
          tooltip: {
            callbacks: {
              title: items => {
                const b = bars[items[0].dataIndex];
                return b.note && !b.partial ? `${b.label} · ${b.note}` : b.label;
              },
              label: item => {
                const b = bars[item.dataIndex];
                return b.partial ? `${b.tag} so far (${b.note})` : `${b.tag} (${b.value.toFixed(2)} points)`;
              },
            },
          },
          // @ts-ignore custom plugin options
          gpaDecorations: {tags: bars.map(b => b.tag), passLine},
        },
        scales: {
          x: {ticks: {color: INK, autoSkip: false, maxRotation: 45}, grid: {display: false}},
          y: {
            min: 0, max: 4, ticks: {color: MUTED, stepSize: 1}, grid: {color: GRID},
            title: {display: true, text: yTitle, color: MUTED},
          },
        },
      },
    }));
  }
}
