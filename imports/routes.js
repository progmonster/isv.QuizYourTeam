import Dashboard from '@material-ui/icons/Dashboard';
import People from '@material-ui/icons/People';
import DashboardPage from '/imports/views/dashboard/dashboard.jsx';
import TeamsPage from '/imports/views/teams/teamsPage';
import QuizEditor from './views/Quizzes/QuizEditor';
import TeamSettings from './views/teams/teamSettings';

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
