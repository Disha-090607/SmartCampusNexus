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
  `
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
