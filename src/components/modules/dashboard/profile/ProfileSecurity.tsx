// components/modules/dashboard/profile/ProfileSecurity.tsx
import { Button } from "@/components/ui/button";
import { Shield, Calendar, Lock, CircleCheckBig } from "lucide-react";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

export default function ProfileSecurity({user}:{user:any}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <div className="bg-[#2c2a2a] p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
        
        <div className="space-y-4">
          
          
          {/* <div className="flex justify-between items-center bg-[#434141] p-4 rounded-md">
            <div className="flex items-center space-x-2">
              <Shield size={18} className="text-blue-400" />
              <span>Nafath Verification</span>
            </div>
            <div className={`flex items-center space-x-2 ${user?.agentProfile?.isNafathVerified ? 'text-emerald-500' : 'text-red-500'}`}>
              <span>{user?.agentProfile?.isNafathVerified ? "Connected & Verified" : "Not Verified"}</span>
              {user?.agentProfile?.isNafathVerified && <CircleCheckBig size={16} />}
            </div>
          </div> */}

          <div className="flex justify-between items-center bg-[#434141] p-4 rounded-md">
            <div className="flex items-center space-x-2">
              <Calendar size={18} className="text-emerald-600" />
              <span>Last Login</span>
            </div>
            <span className="text-gray-300">{formatDate(user?.lastLogin)}</span>
          </div>
          
          <div className="flex justify-center items-center">
            <Button 
              onClick={() => setIsEditModalOpen(true)}
              className="text-white bg-[#434141] hover:bg-emerald-600 w-full"
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        section="security"
      />
    </>
  );
}