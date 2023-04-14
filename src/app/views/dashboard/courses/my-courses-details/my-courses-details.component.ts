import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-courses-details',
  templateUrl: './my-courses-details.component.html',
  styleUrls: ['./my-courses-details.component.scss']
})
export class MyCoursesDetailsComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  back() {
    this.router.navigate(['/dashboard/courses/my-courses'])
  }
}
