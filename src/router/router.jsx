import React, {Suspense} from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// LAYOUTS
import DashboardLayout from "../layouts/dashboard/DashboardLayout.jsx";
import AuthLayout from "../layouts/auth/AuthLayout.jsx";
// LAYOUTS

// AUTH
import IsAuth from "../services/auth/IsAuth";
import IsGuest from "../services/auth/IsGuest";
import LoginPage from "../modules/auth/pages/LoginPage";
// AUTH

// 404
import NotFoundPage from  "../modules/auth/pages/NotFoundPage";
// 404

// PAGES
import OverlayLoader from "../components/OverlayLoader.jsx";
import RewardsPage from "../modules/rewards/RewardsPage.jsx";
import CoursesPage from "../modules/courses/CoursesPage.jsx";
import CourseTypesPage from "../modules/course-types/CourseTypesPage.jsx";
import CourseFormatsPage from "../modules/course-formats/CourseFormatsPage.jsx";
import CategoriesPage from "../modules/categories/CategoriesPage.jsx";
import BoostPricesPage from "../modules/boost-prices/BoostPricesPage.jsx";
import CourseReviewsPage from "../modules/course-reviews/CourseReviewsPage.jsx";
import BoostStatsPage from "../modules/boost-stats/BoostStatsPage.jsx";
import TeachersPage from "../modules/teachers/TeachersPage.jsx";
import StudentsPage from "../modules/students/StudentsPage.jsx";
import LanguagePage from "../modules/language/LanguagePage.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<OverlayLoader />}>
        <IsAuth>
          <Routes>
            <Route path={"/"} element={<DashboardLayout />}>
              <Route path={"/rewards"} element={<RewardsPage />}/>
              <Route path={"/courses"} element={<CoursesPage />}/>
              <Route path={"/course-types"} element={<CourseTypesPage />}/>
              <Route path={"/course-formats"} element={<CourseFormatsPage />}/>
              <Route path={"/categories"} element={<CategoriesPage />}/>
              <Route path={"/boost-prices"} element={<BoostPricesPage />}/>
              <Route path={"/course-reviews"} element={<CourseReviewsPage />}/>
              <Route path={"/boost-stats"} element={<BoostStatsPage />}/>
              <Route path={"/teachers"} element={<TeachersPage />}/>
              <Route path={"/students"} element={<StudentsPage />}/>
              <Route path={"/language"} element={<LanguagePage />}/>
              <Route path={"auth/*"} element={<Navigate to={"/rewards"} replace />}/>
              <Route path={"/"} element={<Navigate to={"/rewards"} replace />}/>
              <Route path={"*"} element={<NotFoundPage />} />
            </Route>
          </Routes>
        </IsAuth>

        <IsGuest>
          <Routes>
            <Route path={"/auth"} element={<AuthLayout />}>
              <Route index element={<LoginPage />} />
            </Route>
            <Route path={"*"} element={<Navigate to={"/auth"} replace />} />
          </Routes>
        </IsGuest>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
