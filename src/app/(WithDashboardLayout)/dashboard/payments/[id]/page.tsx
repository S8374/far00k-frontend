'use client';

import PaymentOverview from '@/components/modules/dashboard/payment/PaymentOverview';
import PaymentMilestones from '@/components/modules/dashboard/payment/PaymentMilestones';
import PropertyDetails from '@/components/modules/dashboard/property/PropertyDetails';
import { useParams, useSearchParams } from 'next/navigation';
import { useGetMeQuery } from '@/redux/api/authApi';
import {
  useGetPaymentPlansByCreatorQuery,
  useGetPaymentPlansByBuyerQuery
} from '@/redux/api/paymentPlanApi';
import { useState } from 'react';
import { useGetBankAccountsByPropertyQuery } from '@/redux/api/bankAccountApi';
import { useGetPropertyInvisitorsByPropertyQuery } from '@/redux/api/invisitorApi';

export default function PaymentSchedulePage() {
  const searchParams = useSearchParams();
  const { data: userData } = useGetMeQuery({});
  const user = userData?.data?.data || userData?.data;
  const role = user?.role;

  const creatorIdFromQuery = searchParams.get("creatorId");
  const propertyId = searchParams.get("propertyId");

  // Fetch as creator
  const { data: creatorData, isLoading: isCreatorLoading } = useGetPaymentPlansByCreatorQuery(
    { creatorId: creatorIdFromQuery, propertyId },
    { 
      skip: !creatorIdFromQuery || role !== "AGENT",
      pollingInterval: 1000 // Poll every 3 seconds for quick updates
    }
  );

  // Fetch as buyer
  const { data: buyerData, isLoading: isBuyerLoading } = useGetPaymentPlansByBuyerQuery(
    { buyerId: user?.id, propertyId },
    { 
      skip: !user?.id || role !== "BUYER",
      pollingInterval: 1000 // Poll every 3 seconds for quick updates
    }
  );

  const data = role === "BUYER" ? buyerData : creatorData;
  const isLoading = role === "BUYER" ? isBuyerLoading : isCreatorLoading;

  const { data: bankAccountsData } = useGetBankAccountsByPropertyQuery(
    { creatorId: creatorIdFromQuery || user?.id, propertyId },
    { skip: !propertyId }
  );
  const { data: propertyInvisitorsData } = useGetPropertyInvisitorsByPropertyQuery(
    { creatorId: creatorIdFromQuery || user?.id, propertyId },
    { skip: !propertyId }
  );

  const paymentPlans = data?.data?.data?.plans || [];

  const paymentPlan = paymentPlans.find(
    (plan: any) => plan.property?.id === propertyId || plan.id === useParams()?.id
  );

  console.log("bankAccountsData Plan:", bankAccountsData);

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!paymentPlan) {
    return <div className="text-white">Plan not found</div>;
  }
  const bankAccounts = bankAccountsData?.data?.data || [];
  const propertyInvisitors = propertyInvisitorsData?.data?.data || [];
  return (
    <div>
      <div className='mb-8'>
        <h1 className="text-2xl md:text-3xl font-semibold">Off-plan Payment Schedule</h1>
        <p className="text-gray-400 mt-1">Track your property payment progress</p>
      </div>
      <div className="rounded-xl border border-white/10 bg-[#3D3D3D] p-3 sm:p-4 lg:p-5">

        {/* Content Card */}
        <div className="space-y-5">
          {/* Overview */}
          <PaymentOverview property={paymentPlan?.property} stats={paymentPlan?.summary} />

          {/* Bottom Section */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">

            {/* Left */}
            <div className="w-full lg:w-[65%]">
              <PaymentMilestones
                milestones={paymentPlan?.milestones || []}
                propertyId={propertyId || ""}
                paymentPlanId={paymentPlan?.id}
                role={role as any}
                userId={user?.id}
              />
            </div>

            {/* Right */}
            <div className="w-full lg:w-[35%]">
              <PropertyDetails bankAccounts={bankAccounts} propertyInvisitors={propertyInvisitors} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}