// components/PropertyItem.tsx
import Image from "next/image";
import { Badge } from "./ui/badge";
import {
  Award,
  Banknote,
  Building2,
  Edit,
  MoreVertical,
  Settings2,
  Trash2,
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Bed,
  Bath,
  Ruler,
  Car,
  Sparkles,
  Tag,
  AlertCircle,
  Home,
  Plus,
  Pencil,
  Copy,
  Landmark,
  Shield,
  Phone,
  Mail,
  User,
  IdCard,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import EditPropertyModal from "./modules/dashboard/modal/EditPropertyModal";
import {
  useDeletePropertyMutation,
} from "@/redux/api/propertyApi";
import ConfirmDeleteDialog from "./shared/ConfirmDeleteDialog";
import { toast } from "sonner";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import CreateUnitModal from "./modules/modal/CreateUnitModal";
import CreateAttributeModal from "./modules/modal/CreateAttributeModal";
import CreateBankAccountModal from "./modules/modal/CreateBankAccountModal";
import CreateInvisitorModal from "./modules/modal/CreateInvisitorModal";
import { useGetMeQuery } from "@/redux/api/authApi";
import CreatePaymentPlanModal from "./modules/modal/CreatePaymentPlanModal";
import CreatePaymentMilestoneModal1 from "./modules/modal/CreatePaymentMilestoneModal1";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import MilestonesList from "./modules/modal/MilestonesList";
import { useGetMilestonesByPlanQuery } from "@/redux/api/mileston.api";
import EditAttributeModal from "./modules/modal/EditAttributeModal";
import EditUnitModal from "./modules/modal/EditUnitModal";
import { useDeletePropertyAttributesMutation } from "@/redux/api/attributeApi";
import { useDeletePropertyUnitsMutation } from "@/redux/api/unitApi";
import { useDeletePaymentPlanByIdMutation } from "@/redux/api/paymentPlanApi";
import {
  useGetBankAccountsByPropertyQuery,
  useDeleteBankAccountMutation,
  useUpdateBankAccountMutation
} from "@/redux/api/bankAccountApi";
import {
  useGetPropertyInvisitorsByPropertyQuery,
  useDeletePropertyInvisitorMutation,
  useUpdatePropertyInvisitorMutation
} from "@/redux/api/invisitorApi";
import EditBankAccountModal from "./modules/modal/EditBankAccountModal";
import EditInvisitorModal from "./modules/modal/EditInvisitorModal";


export function PropertyItem({
  id,
  title,
  price,
  status,
  gigaProject,
  sakNumber,
  listedDate,
  images,
  type,
  _count,
  isRegaVerified,
  paymentPlans,
  addressLine,
  location,
  bedrooms,
  bathrooms,
  areaSqm,
  parkingSlots,
  yearBuilt,
  floorNumber,
  balconies,
  furnished,
  roiProjectionPercent,
  estimatedRentalIncome,
  developer,
  attributes,
  units,
  totalUnits,
  availableUnits,
  createdAt,
  updatedAt,
}: {
  isRegaVerified?: boolean;
  id: string;
  title: string;
  price: string | number;
  status: string;
  visaEligible?: boolean;
  highYield?: boolean;
  gigaProject?: boolean;
  views: number;
  interactions: number;
  leads: number;
  sakNumber: string;
  listedDate: string;
  verification: string;
  images: string[];
  type?: string;
  addressLine?: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  parkingSlots?: number;
  yearBuilt?: number;
  floorNumber?: number;
  balconies?: number;
  furnished?: boolean;
  roiProjectionPercent?: number;
  estimatedRentalIncome?: number;
  developer?: any;
  attributes?: any[];
  units?: any[];
  totalUnits?: number;
  availableUnits?: number;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    paymentPlans: number;
    propertyViews: number;
    savedBy: number;
    units: number;
    paymentMilestones?: number;
  };
  paymentPlans?: any[];
}) {
  const paymentPlan = _count?.paymentPlans || 0;
  const propertyViews = _count?.propertyViews || 0;
  const savedBy = _count?.savedBy || 0;
  const unitsCount = _count?.units || 0;
  const statusColor =
    {
      ACTIVE: "bg-emerald-600",
      PENDING: "bg-yellow-600",
      SOLD: "bg-red-600",
      RENTED: "bg-blue-600",
    }[status] || "bg-gray-600";

  const { data: userData } = useGetMeQuery({});
  const user = userData?.data?.data || userData?.data;

  // Fetch bank accounts for this property
  const { data: bankAccountsData, refetch: refetchBankAccounts } = useGetBankAccountsByPropertyQuery(
    { propertyId: id },
    { skip: !id }
  );
  const bankAccounts = bankAccountsData?.data?.data || [];
  const hasBankAccount = bankAccounts.length > 0;

  // Fetch invisitors for this property
  const { data: invisitorsData, refetch: refetchInvisitors } = useGetPropertyInvisitorsByPropertyQuery(
    { propertyId: id },
    { skip: !id }
  );
  const invisitors = invisitorsData?.data?.data || [];
  const hasInvisitor = invisitors.length > 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [editUnitModalOpen, setEditUnitModalOpen] = useState(false);
  const [attributeModal, setAttributeModal] = useState(false);
  const [editAttributeModal, setEditAttributeModal] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<any>(null);
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [editBankModalOpen, setEditBankModalOpen] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState<any>(null);
  const [invisitorModal, setInvisitorModal] = useState(false);
  const [editInvisitorModal, setEditInvisitorModal] = useState(false);
  const [selectedInvisitor, setSelectedInvisitor] = useState<any>(null);
  const [paymentPlanModal, setPaymentPlanModal] = useState(false);
  const [editPaymentPlanModal, setEditPaymentPlanModal] = useState(false);
  const [paymentMilestoneModal, setPaymentMilestoneModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<string>("plans");
  const [unitId, setUnitId] = useState("");

  const [deleteProperty, { isLoading: deletePropertyLoading }] =
    useDeletePropertyMutation();
  const [deleteAttribute, { isLoading: deleteAttributeLoading }] =
    useDeletePropertyAttributesMutation();
  const [deleteUnit, { isLoading: deleteUnitLoading }] =
    useDeletePropertyUnitsMutation();
  const [deletePlan, { isLoading: deletePlanLoading }] =
    useDeletePaymentPlanByIdMutation();
  const [deleteBankAccount, { isLoading: deleteBankLoading }] =
    useDeleteBankAccountMutation();
  const [deleteInvisitor, { isLoading: deleteInvisitorLoading }] =
    useDeletePropertyInvisitorMutation();

  // Fetch milestones count for selected plan
  const { data: milestonesData, refetch: refetchMilestones } =
    useGetMilestonesByPlanQuery(
      { planId: selectedPlanId! },
      { skip: !selectedPlanId },
    );

  const selectedPlanMilestones = milestonesData?.data?.data || [];
  const selectedPlanMilestonesCount = selectedPlanMilestones.length;
  const selectedPlan = paymentPlans?.find((p) => p.id === selectedPlanId);
  const totalInstallments = selectedPlan?.totalInstallments || 6;
  const reachedLimit = selectedPlanMilestonesCount >= totalInstallments;

  // Update paymentMilestones count when data changes
  useEffect(() => {
    if (selectedPlanId && milestonesData?.data?.data) {
      refetchMilestones();
    }
  }, [selectedPlanId, milestonesData, refetchMilestones]);

  const handleUpdate = () => {
    setIsModalOpen(true);
  };

  const handleDeletePlan = async (id: string) => {
    console.log(id)
    try {
      await deletePlan(id).unwrap();
      toast.success("Plan deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete Plan!.");
    }
  };

  const handleDeleteAttribute = async (id: string) => {
    console.log("attribute id", id);
    try {
      await deleteAttribute(id).unwrap();
      toast.success("Attribute deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete attribute.");
    }
  };

  const handleDeleteUnit = async (id: string) => {
    console.log("unit id", id);
    try {
      await deleteUnit(id).unwrap();
      toast.success("Unit deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete unit.");
    }
  };

  const handleDeleteBankAccount = async (id: string) => {
    try {
      await deleteBankAccount(id).unwrap();
      toast.success("Bank account deleted successfully.");
      refetchBankAccounts();
    } catch (error) {
      toast.error("Failed to delete bank account.");
    }
  };

  const handleDeleteInvisitor = async (id: string) => {
    try {
      await deleteInvisitor(id).unwrap();
      toast.success("Invisitor deleted successfully.");
      refetchInvisitors();
    } catch (error) {
      toast.error("Failed to delete invisitor.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProperty(id).unwrap();
      toast.success("Property deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete property.");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "GOLDEN_VISA":
        return <Sparkles className="h-4 w-4 text-yellow-400" />;
      case "HIGH_YIELD":
        return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case "LUXURY":
        return <Building2 className="h-4 w-4 text-purple-400" />;
      default:
        return <Home className="h-4 w-4 text-blue-400" />;
    }
  };

  const totalUnitsCount = totalUnits || unitsCount || 0;
  const availableUnitsCount = availableUnits || 0;
  const totalPropertyPrice = price || 0;

  const handleAddMilestone = () => {
    if (!selectedPlanId) {
      toast.error("Please select a payment plan first");
      return;
    }
    setPaymentMilestoneModal(true);
  };

  const formatIBAN = (iban: string) => {
    if (!iban) return '';
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <>
      <Card className="group overflow-hidden rounded-2xl border border-stone-700/70 bg-stone-900/80 py-0 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/70 hover:shadow-[0_18px_45px_-25px_rgba(16,185,129,0.55)]">
        <CardContent className="p-0">
          {/* Header with Image */}
          <div className="relative h-52 overflow-hidden">
            <Image
              src={images?.[0] || "/no-image.png"}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-stone-950/90 via-stone-950/35 to-transparent" />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <Badge className={`${statusColor} border-0 text-white shadow-sm`}>
                {status}
              </Badge>
              {type && (
                <Badge
                  variant="outline"
                  className="border-emerald-400/40 bg-stone-950/70 text-emerald-300 backdrop-blur-md"
                >
                  {getTypeIcon(type)}
                  <span className="ml-1">{type?.replace("_", " ")}</span>
                </Badge>
              )}
              {isRegaVerified && (
                <Badge className="border-0 bg-emerald-600/95 text-white shadow-sm">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  REGA Verified
                </Badge>
              )}
              {gigaProject && (
                <Badge className="border-0 bg-violet-600/90 text-white shadow-sm">
                  <Award className="h-3 w-3 mr-1" />
                  Giga Project
                </Badge>
              )}
            </div>

            {/* Price Badge */}
            <div className="absolute bottom-4 right-4">
              <Badge className="border-0 bg-emerald-500 text-base text-white px-4 py-1.5 shadow-lg shadow-emerald-950/40">
                {formatCurrency(Number(price))}
              </Badge>
            </div>

            {/* Actions */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-xl border border-white/15 bg-stone-950/60 p-1.5 backdrop-blur-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleUpdate}
                className="h-8 w-8 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white"
                title="Edit Property"
              >
                <Edit className="h-4 w-4" />
              </Button>

              <ConfirmDeleteDialog
                loading={deletePropertyLoading}
                onConfirm={handleDelete}
                title="Delete Property?"
                description="This property will be permanently deleted."
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-gray-300 hover:bg-white/10 hover:text-red-400"
                    title="Delete Property"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                }
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white"
                    title="More Actions"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-64 bg-stone-900 border-stone-700 text-white"
                >
                  <DropdownMenuLabel>Property Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-stone-700" />

                  <DropdownMenuItem
                    onClick={() => setUnitModalOpen(true)}
                    className="cursor-pointer hover:bg-emerald-700/20"
                  >
                    <Building2 className="w-4 h-4 mr-2 text-emerald-500" />
                    Create Unit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setAttributeModal(true)}
                    className="cursor-pointer hover:bg-emerald-700/20"
                  >
                    <Settings2 className="w-4 h-4 mr-2 text-blue-500" />
                    Create Attribute
                  </DropdownMenuItem>

                  {/* Bank Account - Disabled if exists */}
                  <DropdownMenuItem
                    onClick={() => !hasBankAccount && setBankModalOpen(true)}
                    className={`cursor-pointer ${hasBankAccount ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700/20'}`}
                    disabled={hasBankAccount}
                    title={hasBankAccount ? "Bank account already exists for this property" : undefined}
                  >
                    <Banknote className="w-4 h-4 mr-2 text-yellow-500" />
                    Create Bank Account
                    {hasBankAccount && <CheckCircle2 className="w-3 h-3 ml-2 text-emerald-500" />}
                  </DropdownMenuItem>

                  {/* Invisitor - Disabled if exists */}
                  <DropdownMenuItem
                    onClick={() => !hasInvisitor && setInvisitorModal(true)}
                    className={`cursor-pointer ${hasInvisitor ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700/20'}`}
                    disabled={hasInvisitor}
                    title={hasInvisitor ? "Invisitor already exists for this property" : undefined}
                  >
                    <Users className="w-4 h-4 mr-2 text-purple-500" />
                    Create Invisitor
                    {hasInvisitor && <CheckCircle2 className="w-3 h-3 ml-2 text-emerald-500" />}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-stone-700" />
                  <DropdownMenuLabel>Payment Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-stone-700" />

                  {/* Payment Plan - Disabled if exists */}
                  <DropdownMenuItem
                    onClick={() => !paymentPlan && setPaymentPlanModal(true)}
                    className={`cursor-pointer ${paymentPlan >= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700/20'}`}
                    disabled={paymentPlan >= 1}
                    title={paymentPlan >= 1 ? "This property already has a payment plan" : undefined}
                  >
                    <CreditCard className="w-4 h-4 mr-2 text-emerald-500" />
                    Create Payment Plan
                    {paymentPlan >= 1 && <CheckCircle2 className="w-3 h-3 ml-2 text-emerald-500" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 p-5 md:p-6">
            {/* Title and Location */}
            <div className="flex justify-between">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                {title}
              </h3>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span>
                  {location ||
                    addressLine?.split(",")[0] ||
                    "Location not specified"}
                </span>
                {sakNumber && (
                  <>
                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                    <span className="text-sm flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      Sak: {sakNumber}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <FeatureBox
                icon={<Bed className="h-4 w-4" />}
                label="Bedrooms"
                value={bedrooms || 0}
              />
              <FeatureBox
                icon={<Bath className="h-4 w-4" />}
                label="Bathrooms"
                value={bathrooms || 0}
              />
              <FeatureBox
                icon={<Ruler className="h-4 w-4" />}
                label="Area"
                value={`${areaSqm || 0} m²`}
              />
              <FeatureBox
                icon={<Car className="h-4 w-4" />}
                label="Parking"
                value={parkingSlots || 0}
              />
            </div>

            {/* Stats and Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Units Info */}
              <div className="bg-stone-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Units</span>
                  <span className="text-emerald-400 gap-1 font-semibold">
                    {availableUnitsCount}/{totalUnitsCount} Available
                  </span>
                </div>
              </div>

              {/* Payment Plans */}
              <div className="bg-stone-800/50 flex justify-between rounded-xl p-4">
                <div className="flex items-center gap-1 justify-between mb-2">
                  <span className="text-gray-400 text-sm">Payment Plans</span>
                  <CreditCard className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold text-white">{paymentPlan}</p>
              </div>

              {/* Performance Metrics */}
              <div className="bg-stone-800/50 flex justify-between rounded-xl p-4">
                <div className="flex items-center justify-between mb-2 gap-1">
                  <span className="text-gray-400 text-sm">Performance</span>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex justify-between gap-1 text-sm">
                  <span className="text-gray-400">
                    Views:{" "}
                    <span className="text-white font-semibold">
                      {propertyViews}
                    </span>
                  </span>
                  <span className="text-gray-400">
                    Saved:{" "}
                    <span className="text-white font-semibold">{savedBy}</span>
                  </span>
                </div>
              </div>
            </div>


            {/* Additional Details Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="bg-stone-800 border-stone-700 flex flex-wrap">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-emerald-700"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="attributes"
                  className="data-[state=active]:bg-emerald-700"
                >
                  Attributes ({attributes?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="units"
                  className="data-[state=active]:bg-emerald-700"
                >
                  Units ({units?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="bank-account"
                  className="data-[state=active]:bg-emerald-700"
                >
                  Bank Account ({bankAccounts?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="invisitor"
                  className="data-[state=active]:bg-emerald-700"
                >
                  Invisitor ({invisitors?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <DetailItem label="Year Built" value={yearBuilt || "N/A"} />
                  <DetailItem label="Floor" value={floorNumber || "N/A"} />
                  <DetailItem label="Balconies" value={balconies || 0} />
                  <DetailItem
                    label="Furnished"
                    value={furnished ? "Yes" : "No"}
                  />
                  <DetailItem
                    label="ROI Projection"
                    value={`${roiProjectionPercent || 0}%`}
                  />
                  <DetailItem
                    label="Est. Rental"
                    value={formatCurrency(estimatedRentalIncome || 0)}
                  />
                  <DetailItem
                    label="Developer"
                    value={developer?.name || "N/A"}
                  />
                  <DetailItem label="Listed" value={formatDate(createdAt)} />
                </div>
              </TabsContent>

              <TabsContent value="attributes" className="mt-4">
                {attributes && attributes.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {attributes.map((attr: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-stone-800/30 p-3 rounded-lg border border-stone-700 hover:border-stone-600 transition"
                      >
                        {/* Attribute Key */}
                        <p className="text-sm font-medium text-white">
                          {attr.key?.slice(0, 15)}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {/* Edit */}
                          <button
                            onClick={() => {
                              setSelectedAttribute(attr);
                              setEditAttributeModal(true);
                            }}
                            className="cursor-pointer p-1.5 rounded-md bg-stone-700 hover:bg-stone-600 transition"
                          >
                            <Pencil size={14} className="text-blue-400" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteAttribute(attr.id)}
                            className="cursor-pointer p-1.5 rounded-md bg-stone-700 hover:bg-red-600 transition"
                          >
                            <Trash2
                              size={14}
                              className="text-red-400 hover:text-white"
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No attributes added yet
                  </p>
                )}
              </TabsContent>

              <TabsContent value="units" className="mt-4">
                {units && units.length > 0 ? (
                  <div className="space-y-2">
                    {units.map((unit: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-stone-800/30 p-3 rounded-lg border border-stone-700 flex justify-between items-center"
                      >
                        {/* Unit Info */}
                        <div>
                          <p className="font-medium text-white">
                            {unit.title} {unit.unitNumber}
                          </p>
                          <p className="text-xs text-gray-400">
                            {unit.bedrooms} Bed • {unit.areaSqm} m²
                          </p>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                          {/* Status Badge */}
                          <Badge
                            className={
                              unit.status === "AVAILABLE"
                                ? "bg-emerald-600"
                                : "bg-yellow-600"
                            }
                          >
                            {unit.status}
                          </Badge>

                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              setUnitId(unit?.id);
                              setEditUnitModalOpen(true);
                            }}
                            className="cursor-pointer p-1.5 rounded-md bg-stone-700 hover:bg-stone-600 transition"
                          >
                            <Pencil size={14} className="text-blue-400" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteUnit(unit.id)}
                            className="cursor-pointer p-1.5 rounded-md bg-stone-700 hover:bg-red-600 transition"
                          >
                            <Trash2
                              size={14}
                              className="text-red-400 hover:text-white"
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No units created yet
                  </p>
                )}
              </TabsContent>

              {/* Bank Account Tab */}
              <TabsContent value="bank-account" className="mt-4">
                {bankAccounts && bankAccounts.length > 0 ? (
                  <div className="space-y-4">
                    {bankAccounts.map((account: any) => (
                      <Card key={account.id} className="bg-stone-800/50 border-stone-700">
                        <CardContent className=" space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <Landmark className="h-5 w-5 text-yellow-500" />
                              <h3 className="font-semibold text-white">{account.bankName}   <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30">
                                <Shield className="h-3 w-3 mr-1" />
                                Verified
                              </Badge></h3>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-stone-700">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-700 text-blue-400 hover:bg-blue-700/20"
                                onClick={() => {
                                  setSelectedBankAccount(account);
                                  setEditBankModalOpen(true);
                                }}
                              >
                                <Pencil className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <ConfirmDeleteDialog
                                loading={deleteBankLoading}
                                onConfirm={() => handleDeleteBankAccount(account.id)}
                                title="Delete Bank Account?"
                                description="This bank account will be permanently deleted."
                                trigger={
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-700 text-red-400 hover:bg-red-700/20"
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                  </Button>
                                }
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-400">Account Holder</p>
                              <p className="text-sm font-medium text-white">{account.accountHolder}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Account Number</p>
                              <p className="text-sm font-medium text-white">{account.accountNumber}</p>
                            </div>
                            {account.iban && (
                              <div className="col-span-2">
                                <p className="text-xs text-gray-400">IBAN</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-mono text-white">{formatIBAN(account.iban)}</p>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={() => copyToClipboard(account.iban, 'IBAN')}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                            {account.swiftCode && (
                              <div>
                                <p className="text-xs text-gray-400">SWIFT Code</p>
                                <p className="text-sm font-medium text-white">{account.swiftCode}</p>
                              </div>
                            )}
                            {account.branchAddress && (
                              <div>
                                <p className="text-xs text-gray-400">Branch Address</p>
                                <p className="text-sm font-medium text-white">{account.branchAddress}</p>
                              </div>
                            )}
                          </div>

                          {account.additionalInfo && (
                            <div className="bg-stone-900/50 p-3 rounded-lg">
                              <p className="text-xs text-gray-400">Additional Information</p>
                              <p className="text-sm text-gray-300">{account.additionalInfo}</p>
                            </div>
                          )}


                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center border-2 border-dashed border-stone-700 py-4 rounded-lg">
                    <p className="text-lg text-white mb-2">No bank account added</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Add a bank account for payment processing
                    </p>
                    <Button
                      onClick={() => setBankModalOpen(true)}
                      className="bg-emerald-600 h-6  hover:bg-emerald-700"
                    >
                      Add Bank Account
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Invisitor Tab */}
              <TabsContent value="invisitor" className="mt-4">
                {invisitors && invisitors.length > 0 ? (
                  <div className="space-y-4">
                    {invisitors.map((visitor: any) => (
                      <Card key={visitor.id} className="bg-stone-800/50 border-stone-700">
                        <CardContent className=" space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                                <User className="h-5 w-5 text-purple-400" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white">{visitor.name}         <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/30">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge></h3>
                                <p className="text-xs text-gray-400">
                                  {visitor.relationship?.replace(/_/g, ' ')}
                                </p>
                              </div>
                            </div>


                            <div className="flex justify-end gap-2 pt-2  border-stone-700">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-700 text-blue-400 hover:bg-blue-700/20"
                                onClick={() => {
                                  setSelectedInvisitor(visitor);
                                  setEditInvisitorModal(true);
                                }}
                              >
                                <Pencil className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <ConfirmDeleteDialog
                                loading={deleteInvisitorLoading}
                                onConfirm={() => handleDeleteInvisitor(visitor.id)}
                                title="Delete Invisitor?"
                                description="This invisitor will be permanently deleted."
                                trigger={
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-700 text-red-400 hover:bg-red-700/20"
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                  </Button>
                                }
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {visitor.email && (
                              <div>
                                <p className="text-xs text-gray-400">Email</p>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3 w-3 text-gray-500" />
                                  <p className="text-sm font-medium text-white">{visitor.email}</p>
                                </div>
                              </div>
                            )}
                            {visitor.phoneNumber && (
                              <div>
                                <p className="text-xs text-gray-400">Phone</p>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3 text-gray-500" />
                                  <p className="text-sm font-medium text-white">{visitor.phoneNumber}</p>
                                </div>
                              </div>
                            )}
                            {visitor.idNumber && (
                              <div>
                                <p className="text-xs text-gray-400">ID Number</p>
                                <div className="flex items-center gap-2">
                                  <IdCard className="h-3 w-3 text-gray-500" />
                                  <p className="text-sm font-medium text-white">{visitor.idNumber}</p>
                                </div>
                              </div>
                            )}
                            {visitor.idType && (
                              <div>
                                <p className="text-xs text-gray-400">ID Type</p>
                                <p className="text-sm font-medium text-white">{visitor.idType}</p>
                              </div>
                            )}
                          </div>

                          {visitor.additionalInfo && (
                            <div className="bg-stone-900/50 p-3 rounded-lg">
                              <p className="text-xs text-gray-400">Additional Information</p>
                              <p className="text-sm text-gray-300">{visitor.additionalInfo}</p>
                            </div>
                          )}


                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-2.5 border-2 border-dashed border-stone-700 rounded-lg">
                    <p className="text-lg text-white mb-2">No invisitor added</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Add an invisitor for this property
                    </p>
                    <Button
                      onClick={() => setInvisitorModal(true)}
                      className="bg-emerald-600 h-6 hover:bg-emerald-700"
                    >
                      Add Invisitor
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Payment Plans Section - Only show if paymentPlan > 0 */}
            {paymentPlan > 0 && (
              <div className="border-t border-stone-700 pt-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-semibold flex items-center gap-2 
      bg-linear-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent">
                    <CreditCard className="h-5 w-5 text-emerald-500" />
                    Payment Plans & Milestones
                  </h4>

                  <Badge className="bg-emerald-700/20 text-emerald-400 border border-emerald-700">
                    {paymentPlan} Plans
                  </Badge>
                </div>

                <Tabs
                  defaultValue="plans"
                  value={activeTab}
                  onValueChange={(value) => {
                    setActiveTab(value)
                    if (value === "milestones" && paymentPlans?.length && !selectedPlanId) {
                      setSelectedPlanId(paymentPlans[0].id)
                    }
                  }}
                  className="w-full"
                >
                  {/* Tabs */}
                  <TabsList className="bg-stone-900 border border-stone-700 p-1 rounded-lg">
                    <TabsTrigger
                      value="plans"
                      className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
                    >
                      Payment Plans ({paymentPlan})
                    </TabsTrigger>

                    <TabsTrigger
                      value="milestones"
                      className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
                    >
                      Milestones ({selectedPlanId ? selectedPlanMilestonesCount : 0})
                    </TabsTrigger>
                  </TabsList>

                  {/* PAYMENT PLANS TAB */}
                  <TabsContent value="plans" className="mt-5">
                    <div className="grid gap-4">

                      {(paymentPlans || []).map((plan: any) => {

                        const total = plan.totalInstallments || 6

                        return (
                          <Card
                            key={plan.id}
                            className={`bg-stone-800 border transition-all duration-300
  ${selectedPlanId === plan.id
                                ? "border-emerald-600 bg-emerald-900/20"
                                : "border-stone-700 hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-900/30"
                              }`}
                          >
                            <CardContent className=" ">

                              {/* TOP */}
                              <div className="flex justify-between items-start">

                                <h5 className="font-semibold  text-white text-lg">
                                  {plan.name}

                                  {/* VIEW MILESTONES BUTTON */}
                                  <Button
                                    size="sm"
                                    className="bg-emerald-600 ml-2.5 hover:bg-emerald-700 text-white"
                                    onClick={() => {
                                      setSelectedPlanId(plan.id);
                                      setActiveTab("milestones");
                                    }}
                                  >
                                    View Milestones
                                    <ArrowRight className="h-3 w-3 ml-1" />
                                  </Button>
                                </h5>

                                <div className="flex items-center">
                                  <Badge className="bg-emerald-700/20 text-emerald-400 border border-emerald-700">
                                    {total} Installments
                                    {/* ICON ACTIONS */}

                                  </Badge>
                                  <div className="flex items-center">
                                    {/* DELETE */}
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="cursor-pointer h-8 w-8 text-gray-400 hover:text-red-500"
                                      onClick={() => {
                                        handleDeletePlan(plan.id);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>

                                  </div>
                                </div>
                              </div>

                              {/* BOTTOM ACTIONS */}
                              <div className="flex items-center justify-between">





                              </div>

                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </TabsContent>

                  {/* MILESTONES TAB */}
                  <TabsContent value="milestones" className="mt-5">

                    {selectedPlanId ? (

                      <div className="space-y-4">

                        {/* CREATE MILESTONE */}
                        {!reachedLimit && (
                          <div className="flex justify-end">
                            <Button
                              onClick={handleAddMilestone}
                              className="bg-linear-to-r from-emerald-600 to-green-500 hover:opacity-90 text-white gap-2"
                              size="sm"
                            >
                              <Plus className="h-4 w-4" />
                              Add Milestone ({selectedPlanMilestonesCount}/{totalInstallments})
                            </Button>
                          </div>
                        )}

                        {/* LIMIT REACHED */}
                        {reachedLimit && (
                          <div className="bg-emerald-900/20 border border-emerald-700 p-3 rounded-lg text-center">
                            <p className="text-sm text-emerald-400">
                              All {totalInstallments} milestones created
                            </p>
                          </div>
                        )}

                        {/* MILESTONE LIST */}
                        <MilestonesList
                          key={selectedPlanId}
                          planId={selectedPlanId}
                          totalSteps={totalInstallments}
                        />

                      </div>

                    ) : (

                      <div className="text-center py-12 border-2 border-dashed border-stone-700 rounded-lg">

                        <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-600" />

                        <p className="text-lg text-white mb-2">
                          Select a payment plan
                        </p>

                        <p className="text-sm text-gray-400 mb-4">
                          Choose a plan to see its milestones
                        </p>

                        <Button
                          variant="outline"
                          onClick={() => {
                            if (paymentPlans?.length) {
                              setSelectedPlanId(paymentPlans[0].id)
                            }
                          }}
                          className="border-emerald-700 text-emerald-400 hover:bg-emerald-700/20"
                        >
                          Select First Plan
                        </Button>

                      </div>

                    )}

                  </TabsContent>

                </Tabs>
              </div>
            )}

            {/* Footer with Date */}
            <div className="flex items-center justify-between border-t border-stone-700/80 pt-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-gray-400">
                  <Clock className="h-3 w-3" />
                  Listed: {formatDate(createdAt)}
                </span>
                {updatedAt && updatedAt !== createdAt && (
                  <span className="flex items-center gap-1 text-gray-400">
                    <Clock className="h-3 w-3" />
                    Updated: {formatDate(updatedAt)}
                  </span>
                )}
              </div>
              <Button asChild className="group/cta h-10 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 text-emerald-200 hover:border-emerald-300/60 hover:bg-emerald-500/20 hover:text-white">
                <Link href={`/property/${id}`} className="inline-flex items-center gap-2 text-sm font-medium">
                  <span>View Details</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {isModalOpen && (
        <EditPropertyModal
          onClose={() => setIsModalOpen(false)}
          propertyId={id}
        />
      )}
      <CreateUnitModal
        open={unitModalOpen}
        onClose={() => setUnitModalOpen(false)}
        propertyId={id}
      />
      <EditUnitModal
        open={editUnitModalOpen}
        onClose={() => setEditUnitModalOpen(false)}
        propertyId={id}
        unitId={unitId}
      />
      <CreateAttributeModal
        open={attributeModal}
        onClose={() => setAttributeModal(false)}
        propertyId={id}
      />
      <EditAttributeModal
        open={editAttributeModal}
        onClose={() => setEditAttributeModal(false)}
        propertyId={id}
        attribute={selectedAttribute}
      />
      <CreateBankAccountModal
        open={bankModalOpen}
        onClose={() => {
          setBankModalOpen(false);
          refetchBankAccounts();
        }}
        propertyId={id}
        userId={user?.id}
      />
      <EditBankAccountModal
        open={editBankModalOpen}
        onClose={() => {
          setEditBankModalOpen(false);
          setSelectedBankAccount(null);
          refetchBankAccounts();
        }}
        bankAccount={selectedBankAccount}
        propertyId={id}
      />
      <CreateInvisitorModal
        open={invisitorModal}
        setOpen={(open) => {
          setInvisitorModal(open);
          if (!open) refetchInvisitors();
        }}
        propertyId={id}
        userId={user?.id}
      />
      <EditInvisitorModal
        open={editInvisitorModal}
        onClose={() => {
          setEditInvisitorModal(false);
          setSelectedInvisitor(null);
          refetchInvisitors();
        }}
        invisitor={selectedInvisitor}
        propertyId={id}
      />
      <CreatePaymentPlanModal
        open={paymentPlanModal}
        onClose={() => {
          setPaymentPlanModal(false);
        }}
        propertyId={id}
      />

      <CreatePaymentMilestoneModal1
        open={paymentMilestoneModal}
        onClose={() => {
          setPaymentMilestoneModal(false);
          refetchMilestones();
        }}
        propertyId={id}
        paymentPlanId={selectedPlanId}
        totalPropertyPrice={Number(totalPropertyPrice)}
      />
    </>
  );
}

// Helper Components
function FeatureBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-stone-800/30 flex justify-between rounded-lg p-3 border border-stone-700">
      <div className="flex items-center gap-2 text-gray-400 mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-stone-800/30 p-2 flex justify-between rounded-lg">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}