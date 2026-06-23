// hooks/useDashboardData.ts
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetAgentStatQuery } from "@/redux/api/userApi";
import { useGetMyPropertyQuery } from "@/redux/api/propertyApi";

export const useDashboardData = () => {
  const { 
    data: userData, 
    isLoading: userLoading,
    isFetching: userFetching 
  } = useGetMeQuery({});
  
  const user = userData?.data?.data || userData?.data;
  const agentId = user?.id;
  const isAgent = user?.role === "AGENT";

  const { 
    data: agentStats, 
    isLoading: statsLoading,
    isFetching: statsFetching 
  } = useGetAgentStatQuery({ agentId }, { skip: !agentId || !isAgent });

  const { 
    data: propertiesData, 
    isLoading: propertiesLoading,
    isFetching: propertiesFetching 
  } = useGetMyPropertyQuery(agentId, { skip: !agentId || !isAgent });

  const isLoading = userLoading || (isAgent && (statsLoading || propertiesLoading));
  const isFetching = userFetching || (isAgent && (statsFetching || propertiesFetching));

  const stats = isAgent ? (agentStats?.data?.data || agentStats?.data || {}) : {};
  const properties = isAgent ? (propertiesData?.data?.data || propertiesData?.data || []) : [];

  return {
    user,
    stats,
    properties,
    isLoading,
    isFetching,
    agentId
  };
};