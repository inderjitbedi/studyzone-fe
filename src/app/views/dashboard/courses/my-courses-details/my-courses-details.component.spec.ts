import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCoursesDetailsComponent } from './my-courses-details.component';

describe('MyCoursesDetailsComponent', () => {
  let component: MyCoursesDetailsComponent;
  let fixture: ComponentFixture<MyCoursesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCoursesDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCoursesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
