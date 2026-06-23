import { Button } from "@/components/ui/button";
import { Mail, Phone, CircleCheckBig, Edit } from "lucide-react";

type BuyerProfileContactInfoProps = {
  user: any;
  onEditContact: () => void;
};

export default function BuyerProfileContactInfo({ user, onEditContact }: BuyerProfileContactInfoProps) {
  return (
    <div className="bg-[#2c2a2a] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Buyer Contact Info</h3>
        <Button
          variant="outline"
          onClick={onEditContact}
          className="text-white flex items-center space-x-2 bg-gray-500/20 border-none hover:bg-emerald-700"
        >
          <Edit size={16} />
          <span>Edit</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-300 mb-1">Phone Number</p>
          <div className="flex items-center space-x-2 bg-[#434141] p-3 rounded">
            <Phone size={16} className="text-emerald-500" />
            <span>{user?.phoneNumber || "Not provided"}</span>
            <CircleCheckBig size={16} className="text-emerald-500" />
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-300 mb-1">Email Address</p>
          <div className="flex items-center space-x-2 bg-[#434141] p-3 rounded">
            <Mail size={16} className="text-emerald-500" />
            <span>{user?.email || "Not provided"}</span>
            <CircleCheckBig size={16} className="text-emerald-500" />
          </div>
        </div>
        
      </div>
    </div>
  );
}