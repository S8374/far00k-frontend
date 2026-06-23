"use client"
import AgentProfile from "@/components/modules/dashboard/profile/AgentProfile";
import BuyerProfile from "@/components/modules/dashboard/profile/BuyerProfile";
import { useGetMeQuery } from "@/redux/api/authApi";

export default function ProfilePage() {
    const {data:userData, isLoading} = useGetMeQuery({})
    const user = userData?.data?.data || userData?.data
    const role = user?.role
    if(isLoading) <p>Loading....</p>
    return (
        <>
            {
                role === 'AGENT' ? <AgentProfile /> : <BuyerProfile />
            }
        </>
    );
}