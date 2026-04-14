import { AppProvider, useApp } from "./context/AppContext.jsx";
import TokenAuth from "./components/auth/TokenAuth";
import DevLogin from "./components/auth/DevLogin";
import FeatureFeed from "./components/user/FeatureFeed";
import FeatureDetail from "./components/user/FeatureDetail";
import MyActivity from "./components/user/MyActivity";
import Dashboard from "./components/developer/Dashboard";
import FeatureManagement from "./components/developer/FeatureManagement";
import ReportGenerator from "./components/developer/ReportGenerator";
import ToastContainer from "./components/common/ToastContainer";

function MainRouter() {
  const { currentPage } = useApp();

  let Component = null;

  switch (currentPage.name) {
    case "token-auth":
      Component = <TokenAuth />;
      break;
    case "dev-login":
    case "dev-register":
      Component = <DevLogin />;
      break;
    case "user-feed":
      Component = <FeatureFeed />;
      break;
    case "user-feature-detail":
      Component = <FeatureDetail />;
      break;
    case "user-activity":
      Component = <MyActivity />;
      break;
    case "dev-dashboard":
      Component = <Dashboard />;
      break;
    case "dev-features":
      Component = <FeatureManagement />;
      break;
    case "dev-reports":
      Component = <ReportGenerator />;
      break;
    default:
      Component = <TokenAuth />;
  }

  return (
    <>
      {Component}
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
