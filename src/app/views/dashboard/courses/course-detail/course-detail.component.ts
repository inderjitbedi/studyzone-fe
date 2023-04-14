import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  back(){
    this.router.navigate(['/dashboard/courses/all-courses'])
  }
}
