export const apiConstants = {
  signin: 'auth/login',
  completeSignup: 'auth/complete-signup/:token',
  signup: 'auth/signup',
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

  applyPromo: 'user/course/:id/coupon/:promo/validate',

  paymentIntent: 'user/paymentIntent',
  saveTransaction: 'user/transaction/add',
};
