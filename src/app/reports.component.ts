import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  standalone: true,
  template: `<h2 class="text-xl">📑 Reports</h2>
    <p>Reports content...</p>`,
})
export class ReportsComponent implements OnInit {
  ngOnInit(): void {
    console.log('Reports');
  }
}
