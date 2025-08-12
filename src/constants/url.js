export const URLS = {
  // Auth
  sign_in: '/api/v1/admin/auth/sign-in',

  // Common
  refresh_token: '/api/v1/common/refresh-token',
  enums_all: '/api/v1/common/enums/all',
  enums_weekdays: '/api/v1/common/enums/weekdays',
  enums_student_reward_statuses: '/api/v1/common/enums/student-reward-statuses',
  enums_roles: '/api/v1/common/enums/roles',
  enums_payment_statuses: '/api/v1/common/enums/payment-statuses',
  enums_languages: '/api/v1/common/enums/languages',
  enums_duration_units: '/api/v1/common/enums/duration-units',

  // Rewards
  rewards_create: '/api/v1/admin/rewards',
  rewards_filter: '/api/v1/admin/rewards/filter',
  rewards_get: (id) => `/api/v1/admin/rewards/${id}`,
  rewards_delete: (id) => `/api/v1/admin/rewards/${id}`,
  rewards_patch: (id) => `/api/v1/admin/rewards/${id}`,
  rewards_activate: (id, activate = true) => `/api/v1/admin/rewards/${id}/activate?activate=${activate}`,
  rewards_stats: '/api/v1/admin/rewards/statistics',

  // Courses
  courses_filter: '/api/v1/admin/courses/filter',
  courses_get: (id) => `/api/v1/admin/courses/${id}`,
  courses_delete: (id) => `/api/v1/admin/courses/${id}`,
  courses_activate: (id, activate) => `/api/v1/admin/courses/${id}/activate?activate=${activate}`,
  courses_by_teacher: (teacherId) => `/api/v1/admin/courses/teacher/${teacherId}`,
  courses_by_type: (typeId) => `/api/v1/admin/courses/course-type/${typeId}`,
  courses_by_format: (formatId) => `/api/v1/admin/courses/course-format/${formatId}`,
  courses_by_category: (categoryId) => `/api/v1/admin/courses/category/${categoryId}`,
  courses_available_spots: '/api/v1/admin/courses/available-spots',
  courses_active: '/api/v1/admin/courses/active',

  // Course Types
  course_types_create: '/api/v1/admin/course-types',
  course_types_filter: '/api/v1/admin/course-types/filter',
  course_types_get: (id) => `/api/v1/admin/course-types/${id}`,
  course_types_delete: (id) => `/api/v1/admin/course-types/${id}`,
  course_types_patch: (id) => `/api/v1/admin/course-types/${id}`,
  course_types_activate: (id, activate) => `/api/v1/admin/course-types/${id}/activate?activate=${activate}`,

  // Course Formats
  course_formats_create: '/api/v1/admin/course-formats',
  course_formats_filter: '/api/v1/admin/course-formats/filter',
  course_formats_get: (id) => `/api/v1/admin/course-formats/${id}`,
  course_formats_delete: (id) => `/api/v1/admin/course-formats/${id}`,
  course_formats_patch: (id) => `/api/v1/admin/course-formats/${id}`,
  course_formats_activate: (id, activate) => `/api/v1/admin/course-formats/${id}/activate?activate=${activate}`,

  // Categories
  categories_create: '/api/v1/admin/categories',
  categories_filter: '/api/v1/admin/categories/filter',
  categories_get: (id) => `/api/v1/admin/categories/${id}`,
  categories_delete: (id) => `/api/v1/admin/categories/${id}`,
  categories_patch: (id) => `/api/v1/admin/categories/${id}`,
  categories_activate: (id, activate) => `/api/v1/admin/categories/${id}/activate?activate=${activate}`,
  categories_subcategories: (parentId) => `/api/v1/admin/categories/subcategories/${parentId}`,
  categories_parents: '/api/v1/admin/categories/parents',
  categories_by_course_type: (courseTypeId) => `/api/v1/admin/categories/course-type/${courseTypeId}`,
  categories_active: '/api/v1/admin/categories/active',

  // Boost Prices
  boost_prices_list: '/api/v1/admin/boost-prices',
  boost_prices_create: '/api/v1/admin/boost-prices',
  boost_prices_get: (id) => `/api/v1/admin/boost-prices/${id}`,
  boost_prices_delete: (id) => `/api/v1/admin/boost-prices/${id}`,
  boost_prices_patch: (id) => `/api/v1/admin/boost-prices/${id}`,
  boost_prices_activate: (id, activate) => `/api/v1/admin/boost-prices/${id}/activate?activate=${activate}`,
  boost_prices_active: '/api/v1/admin/boost-prices/active',

  // Boost Stats
  boost_usage_stats: '/api/v1/admin/boost-stats/usage',

  // Course Reviews
  course_reviews_filter: '/api/v1/admin/course-reviews/filter',
  course_reviews_by_course_filter: (courseId) => `/api/v1/admin/course-reviews/course/${courseId}/filter`,
  course_reviews_delete: (id) => `/api/v1/admin/course-reviews/${id}`,
  course_reviews_stats_all: '/api/v1/admin/course-reviews/stats',
  course_reviews_stats_by_course: (courseId) => `/api/v1/admin/course-reviews/course/${courseId}/stats`,

  // Admins
  admins_list: '/api/v1/admin/admins',
  admin_create: '/api/v1/admin/admins',
  admin_get: (id) => `/api/v1/admin/admins/${id}`,
  admin_patch: (id) => `/api/v1/admin/admins/${id}`,
  admin_delete: (id) => `/api/v1/admin/admins/${id}`,

  // Teachers
  teachers_list: '/api/v1/admin/teachers',
  teacher_get: (id) => `/api/v1/admin/teachers/${id}`,

  // Students
  students_list: '/api/v1/admin/students',
  student_get: (id) => `/api/v1/admin/students/${id}`,

  // Languages
  language_get_all: '/api/v1/admin/language/get-all',
  language_get_by_lang: '/api/v1/admin/language/get-by-lang',
  language_create_with_key: '/api/v1/admin/language/create-with-key',
  language_create_key: '/api/v1/admin/language/create-key',
  language_create_edit: '/api/v1/admin/language/create-edit',
};
