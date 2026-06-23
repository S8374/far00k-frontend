/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Check,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Heart,
  Verified,
  CreditCard,
  CircleCheckBig,
  AlertCircle,
  Lock,
  Calendar,
  DollarSign,
  CheckCircle2,
  Award,
  Sparkles,
  Shield,
  Building2,
  Bed,
  Bath,
  Ruler,
  SquareParking,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaDollarSign } from "react-icons/fa6";
import UnitsTable from "@/components/modules/property/UnitsTable";
import { useParams } from "next/navigation";
import {
  useCheckPropertySavedQuery,
  useGetPropertyByIdQuery,
  useSavePropertyMutation,
  useUnsavePropertyMutation,
  useTrackPropertyViewMutation,
} from "@/redux/api/propertyApi";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOffplanPaymentScheduleQuery } from "@/redux/api/paymentPlanApi";
import {
  useTogglePaymentPlanAcceptanceMutation,
} from "@/redux/api/accept.api";
import { MdBalcony } from "react-icons/md";
import { useGetMeQuery } from "@/redux/api/authApi";
import { toast } from "sonner";
import { useStartConversationMutation } from "@/redux/api/messageApi";
import { useRouter } from "next/navigation";

const getSavedStorageKey = (userId?: string | number, propertyId?: string | number) =>
  `saved-property:${String(userId || "guest")}:${String(propertyId || "")}`;

type LocationMapProps = {
  latitude?: number | string | null;
  longitude?: number | string | null;
  title?: string;
};

const LocationMap = ({ latitude, longitude, title }: LocationMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<{ remove: () => void } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const lat = Number(latitude);
  const lng = Number(longitude);
  const hasValidCoordinates =
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180;
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    let canceled = false;

    if (!hasValidCoordinates) {
      setMapError("Map location is not available for this property.");
      return;
    }

    if (!mapboxToken) {
      setMapError("Map cannot load: missing NEXT_PUBLIC_MAPBOX_TOKEN.");
      return;
    }

    setMapError(null);

    const initializeMap = async () => {
      try {
        const mapboxModule = await import("mapbox-gl");
        const mapboxgl = mapboxModule.default;

        if (canceled || !mapContainerRef.current) return;

        mapInstanceRef.current?.remove();
        mapInstanceRef.current = null;

        mapboxgl.accessToken = mapboxToken;

        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/standard",
          center: [lng, lat],
          zoom: 14,
          pitch: 71,
          bearing: -18,
          cooperativeGestures: false,
          antialias: true,
          config: {
            basemap: {
              lightPreset: "night",
              show3dObjects: true,
              showPointOfInterestLabels: true,
              showRoadLabels: true,
              showTransitLabels: false,
            },
          },
        });

        map.on("load", () => {
          map.setFog({
            color: "rgb(11, 15, 26)",
            "high-color": "rgb(36, 52, 78)",
            "space-color": "rgb(4, 7, 14)",
            "horizon-blend": 0.28,
          });
        });

        new mapboxgl.Marker({ color: "#10b981" })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup({ offset: 20 }).setText(title || "Property location"))
          .addTo(map);

        map.addControl(new mapboxgl.NavigationControl(), "top-right");
        mapInstanceRef.current = map;
      } catch {
        if (!canceled) {
          setMapError("Unable to load map right now.");
        }
      }
    };

    initializeMap();

    return () => {
      canceled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [hasValidCoordinates, lat, lng, mapboxToken, title]);

  if (mapError) {
    return (
      <div className="bg-zinc-800 rounded-xl overflow-hidden mb-4 aspect-video flex items-center justify-center">
        <p className="text-gray-400 text-sm text-center px-4">{mapError}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden mb-4 aspect-video">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

const PropertyDetailsPage = () => {
  const [saveProperty, { isLoading: isSavingProperty }] = useSavePropertyMutation();
  const [unsaveProperty, { isLoading: isUnsavingProperty }] = useUnsavePropertyMutation();
  const [togglePaymentPlanAcceptance, { isLoading: isTogglingPaymentPlan }] =
    useTogglePaymentPlanAcceptanceMutation();
  const [trackPropertyView] = useTrackPropertyViewMutation();
  const [startConversation, { isLoading: isStartingConversation }] = useStartConversationMutation();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [activeTab, setActiveTab] = useState("offplan");

  const { data: propertyData, isLoading: propertyLoading } = useGetPropertyByIdQuery(id);
  const { data: offPlanPaymentScheduleData, isLoading: scheduleLoading } =
    useGetOffplanPaymentScheduleQuery(id);
  const { data: userData, isLoading: isUserLoading } = useGetMeQuery({});
  const currentUser = userData?.data?.data || userData?.data || userData;
  const userId = currentUser?.id || currentUser?._id || currentUser?.uid || currentUser?.userId;
  const isTogglingSave = isSavingProperty || isUnsavingProperty;

  const property = propertyData?.data;
  const offPayScheduleData = offPlanPaymentScheduleData?.data;
  const propertyId = property?.id;

  const trackedViewRef = useRef<string | null>(null);

  useEffect(() => {
    if (!propertyId || !userId || typeof window === "undefined") return;

    const key = `property-view:${String(userId)}:${String(propertyId)}`;

    if (trackedViewRef.current === key) return;
    if (window.sessionStorage.getItem(key) === "1") {
      trackedViewRef.current = key;
      return;
    }

    trackedViewRef.current = key;

    trackPropertyView({
      propertyId,
      userId,
      source: "WEBSITE",
    })
      .unwrap()
      .then(() => {
        window.sessionStorage.setItem(key, "1");
      })
      .catch(() => {
        trackedViewRef.current = null;
      });
  }, [propertyId, userId, trackPropertyView]);

  const [isSaved, setIsSaved] = useState(false);

  const { data: savedStatusData } = useCheckPropertySavedQuery(
    { userId, propertyId },
    { skip: !userId || !propertyId },
  );

  useEffect(() => {
    if (!propertyId || typeof window === "undefined") return;

    const key = getSavedStorageKey(userId, propertyId);
    const cached = window.localStorage.getItem(key);
    const hasCachedState = cached === "1" || cached === "0";

    if (cached === "1" || cached === "0") {
      setIsSaved(cached === "1");
    }

    const queryFlag = savedStatusData?.resolved ? savedStatusData?.isSaved : undefined;
    if (typeof queryFlag === "boolean") {
      setIsSaved(queryFlag);
      window.localStorage.setItem(key, queryFlag ? "1" : "0");
      return;
    }

    const runtimeProperty = property as any;
    const directFlag =
      runtimeProperty?.isSaved ??
      runtimeProperty?.isSavedByCurrentUser ??
      runtimeProperty?.saved ??
      runtimeProperty?.favourite ??
      runtimeProperty?.favorite;

    if (typeof directFlag === "boolean") {
      setIsSaved(directFlag);
      window.localStorage.setItem(key, directFlag ? "1" : "0");
      return;
    }

    if (!userId) {
      setIsSaved(false);
      window.localStorage.setItem(key, "0");
      return;
    }

    const savedBy = runtimeProperty?.savedBy;
    if (!Array.isArray(savedBy)) {
      if (hasCachedState) return;
      return;
    }

    const hasCurrentUser = savedBy.some((entry: any) => {
      if (typeof entry === "string" || typeof entry === "number") {
        return String(entry) === String(userId);
      }

      return (
        String(entry?.id) === String(userId) ||
        String(entry?.userId) === String(userId) ||
        String(entry?.user?.id) === String(userId)
      );
    });

    setIsSaved(hasCurrentUser);
    window.localStorage.setItem(key, hasCurrentUser ? "1" : "0");
  }, [property, userId, propertyId, savedStatusData]);

  // Track Property View
  useEffect(() => {
    if (!propertyId || typeof window === "undefined" || isUserLoading) return;

    const viewedKey = `property-view-${propertyId}`;
    const hasViewed = window.localStorage.getItem(viewedKey);
    const isGuestViewedButNowLoggedIn = hasViewed === "guest" && userId;

    if (!hasViewed || isGuestViewedButNowLoggedIn) {
      trackPropertyView({
        propertyId,
        source: "WEBSITE",
        ...(userId ? { userId } : {}),
      })
        .unwrap()
        .then(() => {
          window.localStorage.setItem(viewedKey, userId ? String(userId) : "guest");
        })
        .catch((error) => {
          console.error("Failed to track property view:", error);
        });
    }
  }, [propertyId, userId, isUserLoading, trackPropertyView]);

  // Check if property has payment plans
  const hasPaymentPlan = property?.paymentPlans && property.paymentPlans.length > 0;
  const paymentPlan = property?.paymentPlans?.[0];
  const paymentPlanId = paymentPlan?.id;
  const agentId =
    property?.listingAgentId ||
    property?.agentId ||
    property?.createdById ||
    property?.creatorId ||
    property?.userId ||
    property?.listingAgent?.id ||
    property?.agent?.id;
  const buyerIdForPlan = userId ? String(userId) : undefined;
  const propertyIdForPlan = propertyId ? String(propertyId) : undefined;
  const paymentPlanIdForPlan = paymentPlanId ? String(paymentPlanId) : undefined;
  const agentIdForPlan = agentId ? String(agentId) : undefined;
  const [isPlanAccepted, setIsPlanAccepted] = useState(false);
  const milestones = paymentPlan?.milestones || [];

  // Sort milestones by order
  const sortedMilestones = [...milestones].sort((a, b) => a.milestoneOrder - b.milestoneOrder);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  type NormalizedAttribute = {
    id: string;
    key: string;
    value: string;
  };

  const normalizedAttributes: NormalizedAttribute[] = Array.isArray(property?.attributes)
    ? property.attributes.map((attr: any, index: number): NormalizedAttribute => {
        const key =
          attr?.key ??
          attr?.name ??
          attr?.title ??
          attr?.label ??
          attr?.attributeKey ??
          `Attribute ${index + 1}`;

        const rawValue =
          attr?.value ??
          attr?.isAvailable ??
          attr?.available ??
          attr?.status ??
          attr?.attributeValue;

        const value =
          typeof rawValue === "boolean"
            ? rawValue
              ? "Available"
              : "Unavailable"
            : rawValue != null && rawValue !== ""
              ? String(rawValue)
              : "N/A";

        return {
          id: attr?.id ?? `${key}-${index}`,
          key,
          value,
        };
      })
    : [];


  const [imgError, setImgError] = useState(false);

  const developer = property?.developer;

  if (!developer) return null;

  const initials = developer.name
    ?.split(" ")
    .map((word: string) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Calculate payment progress (only if has payment plan)
  const totalPrice = offPayScheduleData?.totalPrice || property?.price || 0;
  const totalPaid = offPayScheduleData?.totalPaid || 0;
  const percentagePaid = offPayScheduleData?.percentagePaid || 0;
  const remainingAmount = offPayScheduleData?.remainingAmount || totalPrice;
  const verifiedPayments = offPayScheduleData?.verifiedPayments || "0 / 0";
  const pendingReview = offPayScheduleData?.pendingReview || 0;
  const constructionProgress = offPayScheduleData?.paymentProgress?.constructionProgress || 0;

  // Calculate max completed milestone order
  const maxCompletedOrder = sortedMilestones
    .filter((m: any) => m.constructionProgress >= 100)
    .reduce((max: number, m: any) => Math.max(max, m.milestoneOrder), 0);



  const handleToggleSave = async () => {
    try {
      if (!userId) {
        toast.error("Please login first");
        return;
      }

      if (!propertyId) {
        toast.error("Invalid property");
        return;
      }

      if (isTogglingSave) return;

      const key = getSavedStorageKey(userId, propertyId);

      if (isSaved) {
        await unsaveProperty({ propertyId, userId, property }).unwrap();
        setIsSaved(false);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, "0");
        }
        toast.success("Property removed from saved");
      } else {
        await saveProperty({ propertyId, userId, property }).unwrap();
        setIsSaved(true);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, "1");
        }
        toast.success("Property saved successfully");
      }
    } catch (error: any) {
      const status = error?.status;
      const message = String(
        error?.data?.message || error?.data?.error || error?.error || "",
      ).toLowerCase();

      if (status === 409 || message.includes("already")) {
        setIsSaved(true);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(getSavedStorageKey(userId, propertyId), "1");
        }
        toast.success("Property already saved");
        return;
      }

      if (status === 404 || message.includes("not saved") || message.includes("not found")) {
        setIsSaved(false);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(getSavedStorageKey(userId, propertyId), "0");
        }
        toast.success("Property removed from saved");
        return;
      }

      toast.error("Something went wrong!");
    }
  };

  const handlePaymentPlanAction = async () => {
    if (!buyerIdForPlan) {
      toast.error("Please login first");
      return;
    }

    if (!propertyIdForPlan || !paymentPlanIdForPlan || !agentIdForPlan) {
      toast.error("Payment plan data is incomplete");
      return;
    }

    try {
      const response = await togglePaymentPlanAcceptance({
        agentId: agentIdForPlan,
        propertyId: propertyIdForPlan,
        paymentPlanId: paymentPlanIdForPlan,
        buyerId: buyerIdForPlan,
      }).unwrap();

      const nextAccepted =
        response?.accepted ??
        response?.isAccepted ??
        response?.data?.accepted ??
        response?.data?.isAccepted ??
        response?.data?.data?.accepted ??
        response?.data?.data?.isAccepted;

      if (typeof nextAccepted === "boolean") {
        setIsPlanAccepted(nextAccepted);
      } else {
        setIsPlanAccepted((prev) => !prev);
      }

      toast.success(
        typeof nextAccepted === "boolean"
          ? nextAccepted
            ? "Payment plan accepted successfully"
            : "Accepted plan removed successfully"
          : "Payment plan status updated successfully"
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update payment plan acceptance");
    }
  };

  const handleContactAgent = async () => {
    if (!userId) {
      toast.error("Please login to contact the agent");
      return;
    }

    if (!agentId) {
      toast.error("Agent information not available");
      return;
    }

    try {
      await startConversation({
        participantId: agentId as string,
        propertyId: propertyId as string,
        initialMessage: `Hi, I am interested in your property: ${property?.title}`,
      }).unwrap();

      toast.success("Conversation started!");
      router.push("/dashboard/message");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to start conversation");
    }
  };

  if (propertyLoading || scheduleLoading) {
    return (
      <div className="min-h-screen bg-stone-950 text-white p-8">
        <Skeleton className="h-96 w-full bg-stone-800 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64 bg-stone-800 rounded-xl" />
            <Skeleton className="h-48 bg-stone-800 rounded-xl" />
            <Skeleton className="h-96 bg-stone-800 rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 bg-stone-800 rounded-xl" />
            <Skeleton className="h-48 bg-stone-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white overflow-x-hidden">
      <div className=" mx-auto px-4 py-8 lg:px-8 lg:py-12">
        {/* Main Image Swiper */}
        <div className="relative rounded-3xl overflow-hidden">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".custom-prev",
              nextEl: ".custom-next",
            }}
            pagination={{ clickable: true }}
            loop={(property?.images?.length || 0) > 1}
            className="aspect-video lg:aspect-auto"
          >
            {property?.images?.map((img: string, i: number) => (
              <SwiperSlide key={i}>
                <Image
                  src={img}
                  alt={`Property image ${i + 1}`}
                  width={1320}
                  height={807}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </SwiperSlide>
            ))}

            {/* Custom Navigation Arrows */}
            <button type="button" className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-neutral-800/40 cursor-pointer rounded-full p-3 shadow-lg transition">
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            <button type="button" className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-neutral-800/40 rounded-full cursor-pointer p-3 shadow-lg transition">
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          </Swiper>

          {/* Golden Visa Badge */}
          {property?.type === "GOLDEN_VISA" && (
            <div className="absolute top-6 left-6 z-10">
              <Image
                src={"/golden-visa-eligible.png"}
                alt="golden visa"
                height={80}
                width={80}
              />
            </div>
          )}

          {/* REGA Verified Badge */}
          {property?.isRegaVerified && (
            <div className="absolute top-6 right-6 z-10">
              <div className="bg-linear-to-b from-emerald-800 to-emerald-900 rounded-lg px-6 py-2 shadow-xl">
                <p className="text-lg text-center leading-tight flex flex-col">
                  <span className="flex items-center gap-x-1">
                    <Verified className="h-5 w-5" />
                    REGA
                  </span>{" "}
                  <span>VERIFIED</span>
                </p>
              </div>
            </div>
          )}

          {/* Heart Icon */}
          <button
            onClick={handleToggleSave}
            disabled={isTogglingSave}
            className="absolute bottom-6 right-6 bg-emerald-700 backdrop-blur-md rounded-full p-4 shadow-2xl hover:scale-110 transition z-10"
          >
            <Heart
              className={`cursor-pointer w-8 h-8 transition ${isSaved ? "text-red-500 fill-red-500" : "text-white"
                }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-7">
          {/* Left Side - Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Units Section */}
            <div>
              {property?.units && property.units.length > 0 ? (
                <UnitsTable units={property.units} />
              ) : (
                <Card className="bg-stone-900/80 border-stone-800 rounded-2xl overflow-hidden shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-stone-800/50 rounded-full flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">No Units Available</h3>
                      <p className="text-gray-400 max-w-sm">
                        This property does not have individual units listed yet. Please contact the agent for more information about available options.
                      </p>

                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              {/* Main Property Card - Title, Location, Price */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                        {property?.title}
                      </h1>
                      <div className="flex items-center gap-1.5 mt-2 text-zinc-400 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{property?.location || property?.addressLine?.split(',')[0]}</span>
                      </div>
                    </div>

                    <div className="text-right sm:text-right">
                      <p className="text-sm text-zinc-400">Property Price</p>
                      <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
                        {formatCurrency(property?.price || 0)}
                      </p>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
                    <div className="bg-neutral-800/70 border border-neutral-700 rounded-lg p-3 text-center">
                      <Bed className="w-6 h-6 mx-auto" />
                      <p className="text-sm text-zinc-200 font-medium">
                        {property?.bedrooms || 0} Bedrooms
                      </p>
                    </div>

                    <div className="bg-neutral-800/70 border border-neutral-700 rounded-lg p-3 text-center">
                      <Bath className="w-6 h-6 mx-auto" />
                      <p className="text-sm text-zinc-200 font-medium">
                        {property?.bathrooms || 0} Bathrooms
                      </p>
                    </div>

                    <div className="bg-neutral-800/70 border border-neutral-700 rounded-lg p-3 text-center">
                      <MdBalcony className="w-6 h-6 mx-auto" />
                      <p className="text-sm text-zinc-200 font-medium">
                        {property?.balconies || 0} Balconies
                      </p>
                    </div>

                    <div className="bg-neutral-800/70 border border-neutral-700 rounded-lg p-3 text-center">
                      <Ruler className="w-6 h-6 mx-auto" />
                      <p className="text-sm text-zinc-200 font-medium">
                        {property?.areaSqm || 0} m²
                      </p>
                    </div>

                    <div className="bg-neutral-800/70 border border-neutral-700 rounded-lg p-3 text-center">
                      <SquareParking className="w-6 h-6 mx-auto" />
                      <p className="text-sm text-zinc-200 font-medium">
                        Parking {property?.parkingSlots || 0}
                      </p>
                    </div>

                    {/* <div className={`rounded-lg p-3 text-center border ${property?.units && property.units.length > 0 ? 'bg-emerald-800/30 border-emerald-700' : 'bg-yellow-800/30 border-yellow-700'}`}>
                      <div className="text-3xl mb-1">{property?.units && property.units.length > 0 ? '✓' : <SquaresUnite className="w-6 h-6 mx-auto" />}</div>
                      <p className={`text-sm font-medium ${property?.units && property.units.length > 0 ? 'text-emerald-300' : 'text-yellow-300'}`}>
                        {property?.units && property.units.length > 0 ? `${property.units.length} Units` : 'No Units'}
                      </p>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Amenities Section */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 sm:p-6">
                <h2 className="text-xl font-medium text-white mb-4">
                  Property Attributes
                </h2>
                {normalizedAttributes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 text-sm">
                    {normalizedAttributes.map((attr) => (
                      <div key={attr.id} className="flex items-start gap-2 p-3">
                        <span className="text-emerald-500 mt-0.5"><Check className="w-4 h-4" /></span>
                        <div className="space-y-0.5">
                          <p className="text-zinc-500 text-xs uppercase tracking-wide">{attr.key}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Empty State UI
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-800 mb-3">
                      <Info className="text-zinc-500 w-6 h-6 mb-2" />
                    </div>

                    <p className="text-zinc-400 text-sm">
                      No attributes available for this property
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Plan Section - Only show if property has payment plans */}
            {hasPaymentPlan ? (
              <Card className="bg-stone-900/60 border-white/10 shadow-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-linear-to-b from-emerald-500 to-emerald-900 rounded-full flex items-center justify-center shadow-lg">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl">Payment Plan & Milestones</h2>
                </div>

                <Tabs defaultValue="offplan" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-stone-800/50 h-14 rounded-xl p-1">
                    <TabsTrigger
                      value="ready"
                      className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white rounded-lg"
                    >
                      <CircleCheckBig className="w-5 h-5 mr-2" />
                      Ready to Move
                    </TabsTrigger>
                    <TabsTrigger
                      value="offplan"
                      className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white rounded-lg"
                    >
                      Off-Plan
                    </TabsTrigger>
                  </TabsList>

                  {/* Ready to Move Content */}
                  <TabsContent value="ready" className="mt-6">
                    <Card className="bg-emerald-800/10 border-emerald-800/30 p-6">
                      <div className="flex items-start gap-4">
                        <CircleCheckBig className="w-8 h-8 text-emerald-500 mt-1" />
                        <div>
                          <p className="font-medium">
                            Property Ready for Immediate Move-In
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Full payment or bank financing options available
                          </p>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  {/* Off-Plan Content */}
                  <TabsContent value="offplan" className="mt-6 space-y-6">
                    {/* Payment Progress Card - Only show if has payment plan */}
                    {hasPaymentPlan && (
                      <>
                        <Card className="bg-neutral-900/70 border border-white/5 rounded-2xl shadow-xl">
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-yellow-500/20 rounded-full flex items-center justify-center shadow-md">
                                <CreditCard className="w-5 h-5 text-yellow-400" />
                              </div>
                              <CardTitle className="text-lg">
                                Payment Distribution
                              </CardTitle>
                            </div>
                          </CardHeader>

                          <CardContent>
                            <div className="space-y-4">
                              {/* Payment Progress title + amount */}
                              <div className="flex justify-between items-baseline">
                                <p className="text-base text-gray-300">
                                  Payment Progress
                                </p>
                                <div className="text-right">
                                  <p className="text-sm text-gray-400">Total Paid</p>
                                  <p className="text-yellow-400 text-xl font-bold">
                                    {formatCurrency(totalPaid)}
                                    <span className="text-sm text-gray-400 ml-2">
                                      /{formatCurrency(totalPrice)}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {/* Custom Progress Bar */}
                              <div className="relative h-12 bg-transparent border border-white/10 rounded-xl overflow-hidden flex items-center justify-center gap-x-2">
                                <Award className="text-yellow-400" />
                                <p className="text-lg font-normal text-white">
                                  {percentagePaid}% Complete
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Off-Plan Payment Stats */}
                        <Card className="bg-stone-900/60 border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                          <CardHeader>
                            <CardTitle className="text-xl font-normal">
                              Off-Plan Payment Schedule
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="px-4 pb-4 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              {/* Total Price */}
                              <div className="bg-stone-900 border-white/10 rounded-2xl p-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-emerald-500" />
                                    <p className="text-xs text-gray-400">Total Price</p>
                                  </div>
                                  <p className="text-lg font-normal text-white">
                                    {formatCurrency(totalPrice)}
                                  </p>
                                </div>
                              </div>

                              {/* Verified Payments */}
                              <div className="bg-emerald-800/10 border-emerald-800/30 rounded-2xl p-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <p className="text-xs text-gray-400">
                                      Verified Payments
                                    </p>
                                  </div>
                                  <p className="text-xl font-normal text-emerald-500">
                                    {verifiedPayments}
                                  </p>
                                </div>
                              </div>

                              {/* Pending Review */}
                              <div className="bg-yellow-400/10 border-yellow-400/30 rounded-xl p-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                                    <p className="text-xs text-gray-400">
                                      Pending Review
                                    </p>
                                  </div>
                                  <p className="text-xl font-normal text-yellow-400">
                                    {pendingReview}
                                  </p>
                                </div>
                              </div>

                              {/* Construction Progress */}
                              <div className="bg-stone-900 border-white/10 rounded-2xl p-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Image
                                      src={"/property-svg.svg"}
                                      alt="property"
                                      height={20}
                                      width={20}
                                    />
                                    <p className="text-xs text-gray-400">
                                      Construction Progress
                                    </p>
                                  </div>
                                  <p className="text-xl font-normal text-white">
                                    {constructionProgress}%
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Remaining Amount */}
                            <div className="bg-stone-800/50 p-4 rounded-lg">
                              <div className="flex justify-between items-center">
                                <p className="text-gray-400">Remaining Amount</p>
                                <p className="text-xl font-bold text-emerald-400">
                                  {formatCurrency(remainingAmount)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}

                    {/* Milestones Section */}
                    <div className="rounded-md space-y-4">
                      <h3 className="text-lg font-semibold">Payment Milestones</h3>

                      {/* Map through actual milestones from the payment plan */}
                      {sortedMilestones.length > 0 ? (
                        sortedMilestones.map((milestone: any) => {
                          const isLocked = milestone.milestoneOrder > maxCompletedOrder + 1;
                          const isCompleted = milestone.constructionProgress >= 100;
                          const isCurrent = milestone.milestoneOrder === maxCompletedOrder + 1;

                          return (
                            <Card
                              key={milestone.id}
                              className={`bg-stone-900/70 border 
                                ${isCurrent ? "border-yellow-500/50" : "border-white/10"} 
                                rounded-2xl p-6 
                                ${isLocked ? "opacity-70" : ""}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 relative">
                                  <div className="flex items-start gap-6 relative pl-2">
                                    {/* Circle with number / icon */}
                                    <div className="relative shrink-0">
                                      {isCurrent && !isCompleted ? (
                                        <>
                                          {/* glowing circle + exclamation icon */}
                                          <div className="w-12 h-12 relative bg-yellow-300 rounded-full shadow-2xl overflow-hidden flex items-center justify-center">
                                            <AlertCircle className="w-7 h-7 text-black" />
                                          </div>
                                          {/* Small number badge bottom-right */}
                                          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-black rounded-full shadow-2xl border border-gray-700 flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">
                                              {milestone.milestoneOrder}
                                            </span>
                                          </div>
                                        </>
                                      ) : isCompleted ? (
                                        <>
                                          <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-7 h-7 text-white" />
                                          </div>
                                          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-black rounded-full shadow-2xl border border-gray-700 flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">
                                              {milestone.milestoneOrder}
                                            </span>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          {/* lock icon */}
                                          <div className="w-12 h-12 bg-linear-to-br from-white/30 to-black/0 rounded-full flex items-center justify-center relative">
                                            <Lock className="w-6 h-6 text-gray-400" />
                                          </div>
                                          {/* Small number badge bottom-right */}
                                          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-black rounded-full shadow-2xl border border-gray-700 flex items-center justify-center">
                                            <span className="text-gray-400 text-sm font-bold">
                                              {milestone.milestoneOrder}
                                            </span>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-lg">
                                        {milestone.tittle || `Milestone ${milestone.milestoneOrder}`}
                                      </h4>
                                      <p className="text-sm text-gray-400 mt-1">
                                        {milestone.description || "Payment milestone"}
                                      </p>
                                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                                        <div className="border py-2 pl-2 rounded-md bg-[#12121266]">
                                          <p className="text-sm text-gray-400 flex items-center gap-x-1">
                                            <FaDollarSign className="text-xs" />
                                            Amount
                                          </p>
                                          <p className="text-white">
                                            {formatCurrency(milestone.amount || 0)}
                                          </p>
                                        </div>
                                        <div className="border py-2 px-2 rounded-md bg-[#12121266]">
                                          <p className="text-sm text-gray-500">
                                            Construction
                                          </p>
                                          <p className="font-bold text-emerald-400">
                                            {milestone.constructionProgress || 0}%
                                          </p>
                                        </div>
                                        <div className="border py-2 px-4 rounded-md bg-[#12121266]">
                                          <p className="text-sm text-gray-500">
                                            Due Date
                                          </p>
                                          <p className="font-bold flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(milestone.dueDate)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {isCurrent && !isCompleted && (
                                  <Badge className="bg-yellow-700/20 border border-yellow-700/40 text-yellow-500 px-4 py-2 rounded-full flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Action Required
                                  </Badge>
                                )}
                                {isCompleted && (
                                  <Badge className="bg-emerald-700/20 border border-emerald-700/40 text-emerald-500 px-4 py-2 rounded-full flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Completed
                                  </Badge>
                                )}
                                {isLocked && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-gray-700 text-gray-300"
                                  >
                                    <Lock className="w-4 h-4 mr-1" />
                                    Locked
                                  </Badge>
                                )}
                              </div>
                            </Card>
                          );
                        })
                      ) : (
                        <Card className="bg-stone-900/70 border-white/10 rounded-2xl p-12 text-center">
                          <p className="text-gray-400">No milestones created yet for this payment plan</p>
                        </Card>
                      )}

                      {/* REGA Verified Footer - Only show if has payment plan */}
                      {hasPaymentPlan && (
                        <>
                          <div className="border p-4 rounded-md border-white/10 flex items-center gap-3">
                            <div className="bg-emerald-700/30 p-2 rounded-full">
                              <Shield className="w-6 h-6 text-emerald-700" />
                            </div>
                            <div>
                              <p className="text-sm">REGA Verified Payment Plan</p>
                              <p className="text-xs text-gray-400">
                                All milestones monitored by Saudi Real Estate General Authority
                              </p>
                            </div>
                          </div>

                          <Button
                            type="button"
                            onClick={handlePaymentPlanAction}
                            disabled={isTogglingPaymentPlan}
                            className="w-full bg-emerald-700 hover:bg-emerald-800 h-14 text-lg rounded-xl shadow-lg disabled:opacity-70"
                          >
                            <CircleCheckBig className="mr-2" />
                            {isTogglingPaymentPlan
                              ? isPlanAccepted
                                ? "Removing..."
                                : "Accepting..."
                              : isPlanAccepted
                                ? "Remove Accepted Plan"
                                : "Accept this Payment Plan & Proceed"}
                          </Button>

                          <p className="text-center text-xs text-gray-500">
                            All transactions protected by Saudi Real Estate Authority (REGA) laws
                          </p>
                        </>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            ) : (
              /* No Payment Plan Message */
              <Card className="bg-stone-900/60 border-white/10 shadow-xl p-4 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-semibold">No Payment Plan Available</h2>
                  <p className="text-gray-400 max-w-md">
                    This property does not have any payment plans configured yet.
                    Please contact the agent for more information about payment options.
                  </p>

                </div>
              </Card>
            )}

            {/* About This Property */}
            <Card className="bg-stone-900 border-white/10 p-6">
              <h2 className="text-lg mb-4">About This Property</h2>
              <p className="text-gray-400 text-base leading-relaxed whitespace-pre-line">
                {property?.description || "No description available"}
              </p>
            </Card>

            {/* Investment Analysis */}
            <Card className="bg-neutral-900 border-white/10 p-6">
              <h2 className="text-lg mb-6">Investment Analysis</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-neutral-800 rounded-lg px-4 py-4">
                  <p>Price per Sqm</p>
                  <p className="font-medium">
                    {property?.areaSqm ? formatCurrency(property.price / property.areaSqm) : "N/A"}
                  </p>
                </div>
                <div className="flex justify-between items-center bg-neutral-800 rounded-lg px-4 py-4">
                  <p>ROI Projection</p>
                  <p className="font-medium text-emerald-500">
                    {property?.roiProjectionPercent || 0}%
                  </p>
                </div>
                <div className="flex justify-between items-center bg-neutral-800 rounded-lg px-4 py-4">
                  <p>Est. Rental Income</p>
                  <p className="font-medium text-yellow-400">
                    {formatCurrency(property?.estimatedRentalIncome || 0)}/year
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Side - Location & Nearby */}
          <div className="space-y-6">
            {/* Location Map */}
            <Card className="bg-stone-900 border-white/10 p-6">
              <h3 className="text-base mb-4">Location & Proximity</h3>
              <LocationMap
                latitude={property?.latitude}
                longitude={property?.longitude}
                title={property?.title}
              />
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <p className="text-sm">{property?.addressLine || property?.location || "Location not specified"}</p>
              </div>
            </Card>

            {/* Developer Info */}
            <Card className="bg-stone-900 border-white/10 p-6">
              <h3 className="text-base">Developer</h3>
              <div className="flex items-center gap-4">
                {!imgError && developer.logoUrl ? (
                  <Image
                    src={developer.logoUrl}
                    alt={developer.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-12 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white">
                    {initials || "NA"}
                  </div>
                )}

                <div>
                  <p className="font-medium">{developer.name}</p>
                  <p className="text-sm text-gray-400">
                    {developer.description}
                  </p>
                </div>
              </div>
            </Card>

            {/* Nearby Giga-Projects */}
            {property?.nearbyProjects && property.nearbyProjects.length > 0 && (
              <Card className="bg-neutral-900 border-neutral-800 p-4">
                <h3 className="text-base mb-3">Nearby Giga-Projects</h3>
                {property.nearbyProjects.map((project: any) => (
                  <div key={project.id} className="flex items-start gap-x-3 mb-3">
                    <div className="w-2 h-2 bg-emerald-800 rounded-full mt-2" />
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-gray-400">{project.description}</p>
                      {project.distanceKm && (
                        <p className="text-xs text-emerald-500 mt-1">
                          {project.distanceKm} km away
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </div>
        </div>

        {/* Bottom Fixed Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md border-t border-white/10 px-4 py-4 lg:px-14 z-50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xl font-bold text-white">
              {formatCurrency(property?.price || 0)}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleToggleSave}
                disabled={isTogglingSave}
                variant="outline"
                size="lg"
                className="cursor-pointer rounded-full px-6 border-white/10 text-white hover:bg-white/10"
              >
                <Heart className={`cursor-pointer w-5 h-5 transition ${isSaved ? "text-red-500 fill-red-500" : "text-white"
                  }`} />
                Save
              </Button>
              <Button
                size="lg"
                onClick={handleContactAgent}
                disabled={isStartingConversation}
                className="bg-emerald-700 hover:bg-emerald-600 rounded-full px-8 disabled:opacity-50"
              >
                <Check className="w-5 h-5 mr-2" />
                {isStartingConversation ? "Starting..." : "Contact Agent"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;