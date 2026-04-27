import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="screen">
      <header class="admin-topbar">
        <div>
          <h1>SmartCampus Nexus Admin</h1>
          <p>{{ userName }} | {{ role }}</p>
        </div>
        <button (click)="logout()">Logout</button>
      </header>

      <p class="error" *ngIf="error()">{{ error() }}</p>

      <section class="grid stats">
        <article class="panel">
          <h3>Total Users</h3>
          <strong>{{ dashboard()?.stats?.totalUsers || 0 }}</strong>
        </article>
        <article class="panel">
          <h3>Total Notices</h3>
          <strong>{{ dashboard()?.stats?.totalNotices || 0 }}</strong>
        </article>
        <article class="panel">
          <h3>Total Assignments</h3>
          <strong>{{ dashboard()?.stats?.totalAssignments || 0 }}</strong>
        </article>
        <article class="panel">
          <h3>Open Complaints</h3>
          <strong>{{ dashboard()?.stats?.openComplaints || 0 }}</strong>
        </article>
      </section>

      <section class="grid analytics">
        <article class="panel chart-panel wide">
          <div class="panel-head">
            <h2>Activity Trend (Last 7 Days)</h2>
            <span class="hint">Notices vs Complaints</span>
          </div>

          <div class="trend-wrap">
            <div class="trend-row" *ngFor="let day of dailyActivity()">
              <span class="day">{{ day.label }}</span>
              <div class="bars">
                <div
                  class="bar notices"
                  [style.width.%]="(day.notices / trendMax()) * 100"
                  [attr.aria-label]="'Notices ' + day.notices"
                >
                  {{ day.notices }}
                </div>
                <div
                  class="bar complaints"
                  [style.width.%]="(day.complaints / trendMax()) * 100"
                  [attr.aria-label]="'Complaints ' + day.complaints"
                >
                  {{ day.complaints }}
                </div>
              </div>
            </div>
          </div>
        </article>

        <article class="panel chart-panel">
          <div class="panel-head">
            <h2>Complaint Status</h2>
            <span class="hint">Current distribution</span>
          </div>

          <div class="stacked-list">
            <div class="stack-item" *ngFor="let item of complaintStatusData()">
              <div class="label-line">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </div>
              <div class="meter">
                <div class="fill" [style.width.%]="item.percent" [style.background]="item.color"></div>
              </div>
            </div>
          </div>
        </article>

        <article class="panel chart-panel">
          <div class="panel-head">
            <h2>Priority Mix</h2>
            <span class="hint">Complaint priority overview</span>
          </div>

          <div class="stacked-list">
            <div class="stack-item" *ngFor="let item of complaintPriorityData()">
              <div class="label-line">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </div>
              <div class="meter">
                <div class="fill" [style.width.%]="item.percent" [style.background]="item.color"></div>
              </div>
            </div>
          </div>
        </article>

        <article class="panel">
          <div class="panel-head">
            <h2>Quick Insights</h2>
            <span class="hint">Operational pulse</span>
          </div>
          <div class="insights">
            <div class="insight-card">
              <span>Resolution Rate</span>
              <strong>{{ resolutionRate() }}%</strong>
            </div>
            <div class="insight-card">
              <span>High Priority Ratio</span>
              <strong>{{ highPriorityRate() }}%</strong>
            </div>
            <div class="insight-card">
              <span>Notice Volume (7d)</span>
              <strong>{{ noticeVolume7d() }}</strong>
            </div>
            <div class="insight-card">
              <span>Complaint Volume (7d)</span>
              <strong>{{ complaintVolume7d() }}</strong>
            </div>
          </div>
        </article>
      </section>

      <section class="grid">
        <article class="panel">
          <h2>Create Notice</h2>
          <div class="stack">
            <input [(ngModel)]="notice.title" placeholder="Title" />
            <textarea [(ngModel)]="notice.body" placeholder="Notice text"></textarea>
            <button (click)="createNotice()">Publish Notice</button>
          </div>
        </article>

        <article class="panel">
          <h2>Generate Timetable</h2>
          <div class="stack">
            <textarea [(ngModel)]="slotJson" placeholder='[{"courseCode":"CS101",...}]'></textarea>
            <button (click)="generateTimetable()">Run Conflict-safe Generator</button>
          </div>
        </article>

        <article class="panel">
          <h2>Resolve Complaint</h2>
          <div class="stack">
            <input [(ngModel)]="complaintId" placeholder="Complaint ID" />
            <select [(ngModel)]="complaintStatus">
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
            <textarea [(ngModel)]="complaintComment" placeholder="Resolution comment"></textarea>
            <button (click)="updateComplaint()">Update Complaint</button>
          </div>
        </article>

        <article class="panel">
          <h2>Publish Student Result</h2>
          <div class="stack">
            <input [(ngModel)]="result.student" placeholder="Student ID" />
            <input [(ngModel)]="result.semester" type="number" placeholder="Semester" />
            <input [(ngModel)]="result.examType" placeholder="Exam type" />
            <input [(ngModel)]="result.gpa" type="number" step="0.01" placeholder="GPA" />
            <button (click)="publishResult()">Publish Result</button>
          </div>
        </article>
      </section>

      <section class="grid">
        <article class="panel">
          <h2>Recent Notices</h2>
          <div class="item" *ngFor="let item of notices()">
            <strong>{{ item.title }}</strong>
            <p>{{ item.body }}</p>
          </div>
        </article>

        <article class="panel">
          <h2>Complaints</h2>
          <div class="item" *ngFor="let item of complaints()">
            <strong>{{ item.title }}</strong>
            <p>Status: {{ item.status }}</p>
          </div>
        </article>
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .screen {
        min-height: 100vh;
        padding: 1.2rem;
        background:
          radial-gradient(circle at 20% 10%, rgba(26, 162, 255, 0.2), transparent 45%),
          radial-gradient(circle at 80% 0%, rgba(0, 202, 142, 0.15), transparent 40%),
          linear-gradient(180deg, #f4f8ff 0%, #f8fbff 100%);
      }

      .admin-topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        gap: 1rem;
      }

      .admin-topbar h1 {
        margin: 0;
        font-size: 1.4rem;
        color: #12315b;
      }

      .admin-topbar p {
        margin: 0.25rem 0 0;
        color: #4d6285;
      }

      .admin-topbar button,
      button {
        border: 0;
        padding: 0.55rem 0.85rem;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 700;
        color: #fff;
        background: linear-gradient(120deg, #0077ff, #00a884);
      }

      .error {
        margin: 0 0 0.9rem;
        color: #a9122f;
        font-weight: 600;
      }

      .grid {
        display: grid;
        gap: 0.9rem;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        margin-bottom: 0.9rem;
      }

      .stats .panel strong {
        font-size: 1.6rem;
        color: #0c2e5c;
      }

      .panel {
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid #d9e6ff;
        box-shadow: 0 10px 24px rgba(14, 57, 120, 0.08);
        border-radius: 14px;
        padding: 0.9rem;
      }

      .panel h2,
      .panel h3 {
        margin: 0 0 0.5rem;
        color: #183767;
      }

      .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 0.7rem;
      }

      .hint {
        color: #5a6f95;
        font-size: 0.8rem;
      }

      .analytics {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }

      .chart-panel.wide {
        grid-column: span 2;
      }

      .trend-wrap {
        margin-top: 0.6rem;
      }

      .trend-row {
        display: grid;
        grid-template-columns: 62px 1fr;
        align-items: center;
        gap: 0.45rem;
        margin-bottom: 0.5rem;
      }

      .day {
        color: #3b547f;
        font-size: 0.85rem;
      }

      .bars {
        display: grid;
        gap: 0.35rem;
      }

      .bar {
        min-height: 22px;
        border-radius: 7px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 0.5rem;
        font-weight: 700;
        font-size: 0.78rem;
        min-width: 28px;
      }

      .bar.notices {
        background: linear-gradient(90deg, #1167ff, #48a6ff);
      }

      .bar.complaints {
        background: linear-gradient(90deg, #00aa7e, #26d6ad);
      }

      .stacked-list {
        margin-top: 0.6rem;
      }

      .stack-item {
        margin-bottom: 0.6rem;
      }

      .label-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.88rem;
        margin-bottom: 0.3rem;
      }

      .label-line span {
        color: #31507f;
      }

      .label-line strong {
        color: #12335e;
      }

      .meter {
        width: 100%;
        height: 10px;
        background: #e4edff;
        border-radius: 999px;
        overflow: hidden;
      }

      .fill {
        height: 100%;
      }

      .insights {
        display: grid;
        grid-template-columns: repeat(2, minmax(120px, 1fr));
        gap: 0.65rem;
        margin-top: 0.5rem;
      }

      .insight-card {
        padding: 0.6rem;
        border-radius: 10px;
        background: #f3f8ff;
        border: 1px solid #d7e6ff;
      }

      .insight-card span {
        display: block;
        font-size: 0.78rem;
        color: #49628f;
      }

      .insight-card strong {
        font-size: 1.2rem;
        color: #10345e;
      }

      .stack {
        display: grid;
        gap: 0.5rem;
      }

      input,
      textarea,
      select {
        width: 100%;
        border: 1px solid #c7d9ff;
        border-radius: 10px;
        padding: 0.55rem 0.65rem;
        font-size: 0.95rem;
        background: #fff;
        color: #1c3559;
      }

      textarea {
        min-height: 100px;
        resize: vertical;
      }

      .item {
        border-bottom: 1px dashed #d8e2f6;
        padding: 0.5rem 0;
      }

      .item:last-child {
        border-bottom: none;
      }

      .item strong {
        color: #183967;
      }

      .item p {
        margin: 0.3rem 0 0;
        color: #496183;
      }

      @media (max-width: 920px) {
        .chart-panel.wide {
          grid-column: span 1;
        }
      }

      @media (max-width: 700px) {
        .admin-topbar {
          flex-direction: column;
          align-items: flex-start;
        }

        .admin-topbar button {
          width: 100%;
        }

        .insights {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class DashboardComponent {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  readonly dashboard = signal<any>(null);
  readonly notices = signal<any[]>([]);
  readonly complaints = signal<any[]>([]);
  readonly error = signal('');

  readonly notice = { title: '', body: '' };
  slotJson = '[\n  {\n    "courseCode": "CS101",\n    "courseName": "Data Structures",\n    "faculty": "FACULTY_OBJECT_ID",\n    "room": "A-201",\n    "day": "Monday",\n    "startTime": "09:00",\n    "endTime": "10:00",\n    "section": "A",\n    "semester": 3\n  }\n]';

  complaintId = '';
  complaintStatus = 'in-progress';
  complaintComment = '';

  readonly result: any = {
    student: '',
    semester: 1,
    examType: 'Mid Sem',
    gpa: 0,
    items: [
      {
        subjectCode: 'CS101',
        subjectName: 'Data Structures',
        marks: 85,
        maxMarks: 100,
        grade: 'A'
      }
    ]
  };

  userName = 'Admin';
  role = 'admin';

  constructor() {
    const userText = localStorage.getItem('scn_user');
    if (userText) {
      const user = JSON.parse(userText);
      this.userName = user.name || 'Admin';
      this.role = user.role || 'admin';
    }

    this.loadData();
  }

  loadData() {
    this.api.dashboard().subscribe({
      next: (data) => this.dashboard.set(data),
      error: (err) => this.error.set(err?.error?.message || 'Failed to load dashboard')
    });

    this.api.notices().subscribe({
      next: (data) => this.notices.set(data.slice(0, 8)),
      error: () => {}
    });

    this.api.complaints().subscribe({
      next: (data) => this.complaints.set(data.slice(0, 8)),
      error: () => {}
    });
  }

  dailyActivity() {
    const labels = this.lastSevenDayLabels();
    const noticeMap = new Map<string, number>();
    const complaintMap = new Map<string, number>();

    for (const item of this.notices()) {
      const key = this.toDayKey(item?.createdAt);
      if (key) noticeMap.set(key, (noticeMap.get(key) || 0) + 1);
    }

    for (const item of this.complaints()) {
      const key = this.toDayKey(item?.createdAt);
      if (key) complaintMap.set(key, (complaintMap.get(key) || 0) + 1);
    }

    return labels.map((day) => ({
      label: day.label,
      notices: noticeMap.get(day.key) || 0,
      complaints: complaintMap.get(day.key) || 0
    }));
  }

  trendMax() {
    const values = this.dailyActivity().flatMap((item) => [item.notices, item.complaints]);
    return Math.max(1, ...values);
  }

  complaintStatusData() {
    const counts = this.complaints().reduce(
      (acc, item) => {
        const key = String(item?.status || 'open');
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const total = this.complaints().length || 1;
    return [
      { label: 'Open', value: counts['open'] || 0, color: '#f58a24' },
      { label: 'In Progress', value: counts['in-progress'] || 0, color: '#1b7cff' },
      { label: 'Resolved', value: counts['resolved'] || 0, color: '#08a76c' },
      { label: 'Rejected', value: counts['rejected'] || 0, color: '#d13d52' }
    ].map((row) => ({ ...row, percent: Number(((row.value / total) * 100).toFixed(1)) }));
  }

  complaintPriorityData() {
    const counts = this.complaints().reduce(
      (acc, item) => {
        const key = String(item?.priority || 'medium');
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const total = this.complaints().length || 1;
    return [
      { label: 'High', value: counts['high'] || 0, color: '#d53f4f' },
      { label: 'Medium', value: counts['medium'] || 0, color: '#ef9b20' },
      { label: 'Low', value: counts['low'] || 0, color: '#17a773' }
    ].map((row) => ({ ...row, percent: Number(((row.value / total) * 100).toFixed(1)) }));
  }

  resolutionRate() {
    const total = this.complaints().length;
    if (!total) return 0;
    const resolved = this.complaints().filter((item) => item.status === 'resolved').length;
    return Number(((resolved / total) * 100).toFixed(1));
  }

  highPriorityRate() {
    const total = this.complaints().length;
    if (!total) return 0;
    const high = this.complaints().filter((item) => item.priority === 'high').length;
    return Number(((high / total) * 100).toFixed(1));
  }

  noticeVolume7d() {
    return this.dailyActivity().reduce((sum, item) => sum + item.notices, 0);
  }

  complaintVolume7d() {
    return this.dailyActivity().reduce((sum, item) => sum + item.complaints, 0);
  }

  private toDayKey(value: string | undefined) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  private lastSevenDayLabels() {
    const days: Array<{ key: string; label: string }> = [];
    const today = new Date();
    for (let i = 6; i >= 0; i -= 1) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      days.push({
        key: `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`,
        label: day.toLocaleDateString(undefined, { weekday: 'short' })
      });
    }
    return days;
  }

  createNotice() {
    if (!this.notice.title || !this.notice.body) return;
    this.api.createNotice(this.notice).subscribe({
      next: () => {
        this.notice.title = '';
        this.notice.body = '';
        this.loadData();
      },
      error: (err) => this.error.set(err?.error?.message || 'Failed to create notice')
    });
  }

  generateTimetable() {
    try {
      const slots = JSON.parse(this.slotJson);
      this.api.generateTimetable({ slots }).subscribe({
        next: () => {
          this.error.set('');
        },
        error: (err) => this.error.set(err?.error?.message || 'Timetable generation failed')
      });
    } catch {
      this.error.set('Invalid timetable JSON');
    }
  }

  updateComplaint() {
    if (!this.complaintId) return;
    this.api
      .updateComplaint(this.complaintId, {
        status: this.complaintStatus,
        resolutionComment: this.complaintComment
      })
      .subscribe({
        next: () => {
          this.complaintId = '';
          this.complaintComment = '';
          this.loadData();
        },
        error: (err) => this.error.set(err?.error?.message || 'Complaint update failed')
      });
  }

  publishResult() {
    this.api.publishResult(this.result).subscribe({
      next: () => {
        this.error.set('');
      },
      error: (err) => this.error.set(err?.error?.message || 'Result publish failed')
    });
  }

  logout() {
    localStorage.removeItem('scn_token');
    localStorage.removeItem('scn_user');
    this.router.navigateByUrl('/');
  }
}
