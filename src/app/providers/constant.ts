import { environment } from './../../environments/environment';

export namespace Constants {
  export const version = `Version: ${environment.version}`;

  export const productName = 'Studyzone';

  export const copyright = `Copyright © ${new Date().getFullYear()}`;

  export const rightReserved = 'All rights reserved.';

  export const Pages = {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    ALL_COURSES: '/dashboard/courses/all',
    MY_COURSES: '/dashboard/courses/my-courses',
    MY_COURSE_DETAILS: '/dashboard/courses/my-course/:id/details',
    SLIDE_DETAILS: '/dashboard/courses/my-course/:id/slide/:slideid',
  };
  export const ErrorMessages = {
    serverError: 'Server Error.',
    sessionExpired: 'Session Expired.',
  };

  export const ConfirmMessages = {};
  export const SuccessMessages = {};
}
