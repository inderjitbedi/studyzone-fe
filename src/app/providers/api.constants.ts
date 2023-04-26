export const apiConstants = {
  signin: 'auth/login',
  signup: 'auth/login',
  emailUniqueness: 'auth/check-uniqueness-email/',

  allCourses: 'user/course/all',
  myCourses: 'user/course/my-courses',
  getCourseDetails: 'user/course/:id/details',
  requestEnrollment: 'user/course/:id/requestEnrollment',
  enrollCourse: 'user/course/:id/enrollCourse',
  getMyCourseDetails: 'user/course/my-course/:id/details',
  getSlideDetails: 'user/course/:id/slide/:slideid/details',

  markProgress: 'user/course/:id/slide/:slideid/markProgress',
  getProgress: 'user/course/:id/getProgress',


  addComment: 'user/course/:id/comment',
  deleteComment: 'user/course/:id/comment/:commentId',

  slide: 'user/course/:id/slide/list',
  createSlide: 'user/course/:id/slide',
  updateSlide: 'user/course/:id/slide/:slideid',
  reorderSildes: 'user/course/:id/slide/list/reorder',
  manageSlideAccess: 'user/course/manage-visibility/',
  checkSlideUniqueness: 'user/check-uniqueness-course/',

  courseEnrollment: 'user/course/:id/enrollUser',
  getEnrollments: 'user/course/:id/getEnrollments',
  getEnrollmentRequests: 'user/course/:id/getEnrollmentRequests',
  getUsersToEnroll: 'user/course/:id/getUsersToEnroll',
};
