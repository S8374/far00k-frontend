// components/modules/dashboard/profile/ProfileOverview.tsx
import { useGetAgentPerformanceQuery } from "@/redux/api/agent.api";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import { ProfileSkeleton } from "../../Skeleton/ProfileSkeleton";

export default function ProfileOverview({ id, bio, user }: { id: any, bio: any, user: any }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data, isLoading, isFetching } = useGetAgentPerformanceQuery({ agentId: id });
  const stats = data?.data?.data;

  // if (isLoading || isFetching) {
  //   return <OverviewSkeleton />;
  // }

  return (
    <>
      <div>
        {/* Performance Statistics */}
        <div className="bg-[#2c2a2a] p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Performance Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-200/20 p-3 rounded">
              <p className="text-sm text-gray-400">Total Listings</p>
              <p className="text-2xl font-bold">{stats?.totalListings || 0}</p>
            </div>
            <div className="bg-gray-200/20 p-3 rounded">
              <p className="text-sm text-gray-400">Active Listings</p>
              <p className="text-2xl font-bold text-emerald-600">{stats?.activeListings || 0}</p>
            </div>
            <div className="bg-gray-200/20 p-3 rounded">
              <p className="text-sm text-gray-400">Deals Completed</p>
              <p className="text-2xl font-bold">{stats?.dealsCompleted || 0}</p>
            </div>
          </div>
        </div>

        {/* Specialization & Bio */}
        <div className="bg-[#2c2a2a] p-4 rounded-lg mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Specialization & Bio</h3>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(true)}
              className="text-white flex items-center space-x-2 bg-gray-500/20 border-none hover:bg-emerald-700"
            >
              <Edit size={16} />
              <span>Edit</span>
            </Button>
          </div>
          <p className="text-sm text-gray-300">
            {bio || "No bio available"}
          </p>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        section="bio"
      />
    </>
  );
}