import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  viewDetails() {
    this.router.navigate(['/dashboard/courses/my-course/details'])
  }
}
