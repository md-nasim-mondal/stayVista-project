import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import GuestStatistics from "../Guest/GuestStatistics";
import HostStatistics from "../Host/HostStatistics";
import useRole from "./../../../hooks/useRole";
import AdminStatistics from "./../Admin/AdminStatistics";
const Statistics = () => {
  const [role, isLoading] = useRole()
  if(isLoading) return <LoadingSpinner/>
  return (
    <>
      {role === 'admin' && <AdminStatistics/>}
      {role === 'host' && <HostStatistics/>}
      {role === 'guest' && <GuestStatistics/>}
    </>
  );
};

export default Statistics;