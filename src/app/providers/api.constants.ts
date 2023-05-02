export const apiConstants = {
  signin: 'auth/login',
  signup: 'auth/complete-signup/:token',
  emailUniqueness: 'auth/check-uniqueness-email/',
  forgotPassword: 'auth/forgot-password',
  resetPassword: 'auth/reset-password/:token',
  

  allCourses: 'user/course/all',
  myCourses: 'user/course/my-courses',
  getCourseDetails: 'user/course/:id/details',
  requestEnrollment: 'user/course/:id/requestEnrollment',
  enrollCourse: 'user/course/:id/enrollCourse',
  getMyCourseDetails: 'user/course/my-course/:id/details',
  getSlideDetails: 'user/course/:id/slide/:slideid/details',

  markProgress: 'user/course/:id/slide/:slideid/markProgress',
  getProgress: 'user/course/:id/getProgress',
  changePassword: 'user/changePassword',
  profile: 'user/profile',

  addComment: 'user/course/:id/comment',
  deleteComment: 'user/course/:id/comment/:commentId',

};
