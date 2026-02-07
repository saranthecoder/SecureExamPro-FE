import { Navigate } from "react-router-dom";

const CoreAdminRoute = ({ children }: { children: JSX.Element }) => {
  const isCoreAdmin = localStorage.getItem("coreAdmin");

  if (!isCoreAdmin) {
    return <Navigate to="/coreadmin-login" />;
  }

  return children;
};

export default CoreAdminRoute;
