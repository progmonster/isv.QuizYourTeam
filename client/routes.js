import Dashboard from '@material-ui/icons/Dashboard';
import People from '@material-ui/icons/People';
import DashboardPage from '/client/views/dashboard/dashboardPage.jsx';
import TeamsPage from '/client/views/teams/teamsPage';
import QuizEditor from './views/quizzes/quizEditorPage';
import TeamSettings from './views/teams/teamSettingsPage';
import QuizLearnPage from './views/quizzes/quizLearnPage';
import QuizPassPage from './views/quizzes/pass/quizPassPage';

export const routes = [
  {
    path: '/dashboard',
    name: 'Quizzes',
    icon: Dashboard,
    component: DashboardPage,
    showInDrawer: true,
  },

  {
    path: '/quiz-edit/:quizId?',
    name: 'Edit Quiz',
    icon: Dashboard,
    component: QuizEditor,
    showInDrawer: false,
  },

  {
    path: '/quiz-learn/:quizId?',
    name: 'Learn Quiz',
    icon: Dashboard,
    component: QuizLearnPage,
    showInDrawer: false,
  },

  {
    path: '/quiz-pass/:quizId?',
    name: 'Pass Quiz',
    icon: Dashboard,
    component: QuizPassPage,
    showInDrawer: false,
  },

  {
    path: '/teams',
    name: 'Your Teams',
    icon: People,
    component: TeamsPage,
    showInDrawer: true,
  },

  {
    path: '/team-settings/:teamId?',
    name: 'Team Settings',
    icon: People,
    component: TeamSettings,
    showInDrawer: false,
  },
];

export const drawerRoutes = routes.filter(({ showInDrawer }) => showInDrawer);
