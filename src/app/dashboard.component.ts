import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `<h2 class="text-xl">📊 Dashboard</h2>
    <p>Some dashboard content here...</p>`,
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {
    console.log('Dashboard');
  }
}
