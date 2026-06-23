import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, DollarSign, Hammer } from 'lucide-react';
import Image from 'next/image';

// Helper function to format currency
const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return `${currency} ${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

export default function PaymentOverview({ property, stats }: any) {
    console.log("PaymentOverview Property:", property, "Stats:", stats);
    
    // Get first image from property
    const firstImage = property?.images?.[0] || property?.imageUrl?.[0] || '/placeholder-image.jpg';
    
    // Calculate verified payments display
    const verifiedPaymentsDisplay = stats?.display?.verifiedPayments || 
        `${stats?.verifiedMilestones || 0} / ${stats?.totalMilestones || 0}`;
    
    return (
        <div className="w-full space-y-4">
            {/* Header - Using actual property data instead of paymentData */}
            <Card className=" border-white/10 rounded-lg overflow-hidden">
                <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-4">
                        {/* Left - Image */}
                        <div className="flex items-center gap-3">
                            <div className="relative h-12 w-16 sm:h-14 sm:w-20 md:h-16 md:w-24 shrink-0 rounded-md overflow-hidden border border-white/10">
                                <Image
                                    src={firstImage}
                                    alt={property?.title || 'Property'}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm sm:text-base font-semibold text-white truncate">{property?.title || 'Property'}</h3>
                                <span className="text-[11px] sm:text-xs font-medium text-gray-300 block">
                                    ID: {property?.id?.slice(-8) || 'N/A'}
                                </span>
                                {property?.isBooked && (
                                    <span className="mt-1 inline-flex px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-[10px] border border-blue-400/20">
                                        Booked
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Right - Payment Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between gap-3 text-sm mb-1">
                                <p className="text-gray-300 text-xs sm:text-sm">Payment Progress</p>
                                <div className="text-right">
                                        <p className="text-[10px] sm:text-xs text-gray-400">Total Paid</p>
                                        <p className="font-semibold text-sm sm:text-lg text-yellow-400 leading-tight">
                                            {formatCurrency(stats?.totalPaid || 0, property?.currency)}
                                            <span className="text-gray-400 text-[10px] sm:text-xs ml-1">
                                                /{formatCurrency(stats?.totalPrice || 0, property?.currency)}
                                            </span>
                                        </p>
                                </div>
                            </div>
                            <div className="w-full h-6 rounded-full bg-white/25 overflow-hidden">
                                <Progress
                                    value={stats?.paymentProgress || 0}
                                    className="h-6 bg-transparent *:bg-[#00A34A]"
                                />
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[10px] sm:text-xs">
                                <span className="text-gray-300">{stats?.paymentProgress || 0}%</span>
                                <span className="text-gray-400">
                                    {stats?.verifiedMilestones || 0}/{stats?.totalMilestones || 0} milestones
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Total Price */}
                <Card className="bg-[#1F2227] border-white/10 rounded-lg">
                    <CardContent className="p-3 sm:p-4 space-y-1.5">
                        <div className="flex items-center gap-2">
                            <DollarSign size={14} className="text-emerald-500" />
                            <p className="text-gray-400 text-[10px] sm:text-xs">Total Price</p>
                        </div>
                        <p className="text-sm sm:text-base font-semibold text-white leading-snug">
                            {formatCurrency(stats?.totalPrice || 0, property?.currency)}
                        </p>
                    </CardContent>
                </Card>

                {/* Verified Payments */}
                <Card className="bg-[#1F2227] border-emerald-700/60 rounded-lg">
                    <CardContent className="p-3 sm:p-4 space-y-1.5">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-emerald-500" />
                            <p className="text-gray-400 text-[10px] sm:text-xs">Verified Payments</p>
                        </div>
                        <p className="text-base sm:text-lg font-semibold text-emerald-400 leading-tight">
                            {verifiedPaymentsDisplay}
                        </p>
                    </CardContent>
                </Card>

                {/* Pending Review */}
                <Card className="bg-[#1F2227] border-yellow-700/60 rounded-lg">
                    <CardContent className="p-3 sm:p-4 space-y-1.5">
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-yellow-400" />
                            <p className="text-gray-400 text-[10px] sm:text-xs">Pending Review</p>
                        </div>
                        <p className="text-base sm:text-lg font-semibold text-yellow-400 leading-tight">
                            {stats?.display?.pendingReviews || stats?.pendingMilestones || 0}
                        </p>
                    </CardContent>
                </Card>

                {/* Construction Progress */}
                <Card className="bg-[#1F2227] border-white/10 rounded-lg">
                    <CardContent className="p-3 sm:p-4 space-y-1.5">
                        <div className="flex items-center gap-2">
                            <Hammer size={14} className="text-gray-300" />
                            <p className="text-gray-400 text-[10px] sm:text-xs">Construction Progress</p>
                        </div>
                        <p className="text-base sm:text-lg font-semibold text-white leading-tight">
                            {stats?.constructionProgress || 0}%
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}