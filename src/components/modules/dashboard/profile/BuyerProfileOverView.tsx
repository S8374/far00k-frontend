import { useGetBuyerPerformanceStatsQuery } from "@/redux/api/mileston.api";
import { Button } from "@/components/ui/button";
import { CircleCheckBig, Edit, Mail, Phone, Loader2 } from "lucide-react";

type BuyerProfileOverviewProps = {
  user: any;
  onEditContact: () => void;
};

export default function BuyerProfileOverview({ user, onEditContact }: BuyerProfileOverviewProps) {
  const buyerId = String(user?.id || user?._id || user?.uid || user?.userId || "");

  const { data: statsData, isLoading: isStatsLoading } = useGetBuyerPerformanceStatsQuery(buyerId, {
    skip: !buyerId,
  });

  const stats = {
    propertiesViewed: Number(statsData?.propertiesViewed || 0),
    propertiesSaved: Number(statsData?.propertiesSaved || 0),
    propertiesOwned: Number(statsData?.propertiesOwned || 0),
  };

  const defaults = {
    propertiesViewed: 0,
    propertiesSaved: 0,
    propertiesOwned: 0,
  };

  return (
    <div>
      {/* Performance Statistics */}
      <div className="bg-[#2c2a2a] p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Buyer Performance Statistics</h3>
          {isStatsLoading && <Loader2 className="animate-spin text-emerald-500" size={16} />}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-200/20 p-3 rounded">
            <p className="text-sm text-gray-400">Properties Viewed</p>
            <p className="text-2xl font-bold">{stats.propertiesViewed ?? defaults.propertiesViewed}</p>
          </div>
          <div className="bg-gray-200/20 p-3 rounded">
            <p className="text-sm text-gray-400">Properties Saved</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.propertiesSaved ?? defaults.propertiesSaved}</p>
          </div>
          <div className="bg-gray-200/20 p-3 rounded">
            <p className="text-sm text-gray-400">Properties Owned</p>
            <p className="text-2xl font-bold">{stats.propertiesOwned ?? defaults.propertiesOwned}</p>
          </div>
        </div>
      </div>

      {/* Specialization & Bio */}
      <div className="bg-[#2c2a2a] p-4 rounded-lg mt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <Button
            variant="outline"
            onClick={onEditContact}
            className="text-white flex items-center space-x-2 bg-gray-500/20 border-none hover:bg-emerald-700"
          >
            <Edit size={16} />
            <span>Edit</span>
          </Button>
        </div>

        <div className="flex items-center space-x-2 bg-[#383636] p-3 rounded justify-between">
          <div className="flex items-center gap-1">
            <Phone size={16} className="text-emerald-500" />
            <span>{user?.phoneNumber || "Not provided"}</span>
          </div>
          <CircleCheckBig size={16} className="text-emerald-500" />
        </div>

        <div className="flex items-center space-x-2 bg-[#383636] p-3 rounded mt-4 justify-between">
          <div className="flex items-center gap-1">
            <Mail size={16} className="text-emerald-500" />
            <span>{user?.email || "Not provided"}</span>
          </div>
          <CircleCheckBig size={16} className="text-emerald-500" />
        </div>
      </div>
    </div>
  );
}