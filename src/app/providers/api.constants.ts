export const apiConstants = {
  signin: 'auth/login',

  allCourses: 'user/course/all',

  createCourse: 'user/course',
  getCourseDetails: 'user/course/',
  updateCourse: 'user/course/',
  deleteCourse: 'user/course/:id/delete',
  manageCourseAccess: 'user/course/manage-visibility/',
  checkCourseUniqueness: 'user/check-uniqueness-course/',
  addComment: 'user/course/:id/comment',
  deleteComment: 'user/course/:id/comment/:commentId',

  slide: 'user/course/:id/slide/list',
  createSlide: 'user/course/:id/slide',
  updateSlide: 'user/course/:id/slide/:slideid',
  getSlideDetails: 'user/course/:id/slide/:slideid',
  reorderSildes: 'user/course/:id/slide/list/reorder',
  manageSlideAccess: 'user/course/manage-visibility/',
  checkSlideUniqueness: 'user/check-uniqueness-course/',

  courseEnrollment: 'user/course/:id/enrollUser',
  getEnrollments: 'user/course/:id/getEnrollments',
  getEnrollmentRequests: 'user/course/:id/getEnrollmentRequests',
  getUsersToEnroll: 'user/course/:id/getUsersToEnroll',
};
