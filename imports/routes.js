import Dashboard from "@material-ui/icons/Dashboard";
import People from "@material-ui/icons/People";
import DashboardPage from "/imports/views/Dashboard/dashboard.jsx";
import Team from "/imports/views/Team/Team.jsx";
import QuizEditor from "./views/Quizzes/QuizEditor";

export const routes = [
  {
    path: "/dashboard",
    name: "Quizzes",
    icon: Dashboard,
    component: DashboardPage,
    showInDrawer: true,
  },

  {
    path: "/quiz-edit/:quizId?",
    name: "Edit Quiz",
    icon: Dashboard,
    component: QuizEditor,
    showInDrawer: false,
  },

  {
    path: "/team",
    name: "Your Team",
    icon: People,
    component: Team,
    showInDrawer: true,
  },
];

export const drawerRoutes = routes.filter(({ showInDrawer }) => showInDrawer);
