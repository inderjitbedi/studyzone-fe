import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.scss']
})
export class AllCoursesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  viewDetails() {
    this.router.navigate(['/dashboard/courses/course/details'])
  }

}
