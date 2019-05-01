// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
/*import Person from "@material-ui/icons/Person";*/
import People from "@material-ui/icons/People";
/*
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";
*/
// core components/views for Admin layout
import DashboardPage from "/imports/views/Dashboard/dashboard.jsx";
/*import UserProfile from "/imports/views/UserProfile/UserProfile.jsx";*/
import Team from "/imports/views/Team/Team.jsx";
import QuizEditor from "./views/Quizzes/QuizEditor";
/*
import TableList from "/imports/views/TableList/TableList.jsx";
import Typography from "/imports/views/Typography/Typography.jsx";
import Icons from "/imports/views/Icons/Icons.jsx";
import Maps from "/imports/views/Maps/Maps.jsx";
import UpgradeToPro from "/imports/views/UpgradeToPro/UpgradeToPro.jsx";
*/
// core components/views for RTL layout
/*import RTLPage from "/imports/views/RTLPage/RTLPage.jsx";*/

export const routes = [
  {
    path: "/edit-quiz",
    name: "Edit Quiz",
    rtlName: "Edit Quiz",
    icon: Dashboard,
    component: QuizEditor,
    layout: "/admin",
    showInDrawer: false,
  },

  {
    path: "/dashboard",
    name: "Quizzes",
    rtlName: "Quizzes",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
    showInDrawer: true,
  },
/*
  {
    path: "/user",
    name: "Your Profile",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: UserProfile,
    layout: "/admin"
  },
*/
  {
    path: "/team",
    name: "Your Team",
    rtlName: "Team",
    icon: People,
    component: Team,
    layout: "/admin",
    showInDrawer: true,
  },
/*
  {
    path: "/table",
    name: "Table List",
    rtlName: "قائمة الجدول",
    icon: "content_paste",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/typography",
    name: "Typography",
    rtlName: "طباعة",
    icon: LibraryBooks,
    component: Typography,
    layout: "/admin"
  },
  {
    path: "/icons",
    name: "Icons",
    rtlName: "الرموز",
    icon: BubbleChart,
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/maps",
    name: "Maps",
    rtlName: "خرائط",
    icon: LocationOn,
    component: Maps,
    layout: "/admin"
  },
  {
    path: "/upgrade-to-pro",
    name: "Upgrade To PRO",
    rtlName: "التطور للاحترافية",
    icon: Unarchive,
    component: UpgradeToPro,
    layout: "/admin"
  },
  {
    path: "/rtl-page",
    name: "RTL Support",
    rtlName: "پشتیبانی از راست به چپ",
    icon: Language,
    component: RTLPage,
    layout: "/rtl"
  }
*/
];

export const drawerRoutes = routes.filter(({ showInDrawer }) => showInDrawer);
