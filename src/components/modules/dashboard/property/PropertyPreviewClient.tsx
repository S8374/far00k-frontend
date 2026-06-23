'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
    Check, MapPin, ChevronLeft, ChevronRight, Heart, X, Verified,
    CreditCard, CircleCheckBig, AlertCircle, Lock, Calendar, Hammer,
    DollarSign, CheckCircle2, Award, Sparkles, Shield, MoveLeft,
    CircleAlert,
    Edit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProgressIndicator } from '@radix-ui/react-progress';
import { offPlanMilestones } from '@/data/propertyData';
import { FaDollarSign } from 'react-icons/fa6';
import { toast } from 'sonner';

const PropertyPreviewClient = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [previewData, setPreviewData] = useState<any>(null);

    useEffect(() => {
        const previewDataParam = searchParams.get('previewData');
        if (previewDataParam) {
            try {
                const parsedData = JSON.parse(previewDataParam);
                setPreviewData(parsedData);
            } catch (error) {
                console.error("Error parsing preview data:", error);
            }
        }
    }, [searchParams]);

    if (!previewData) {
        return <div className="min-h-screen bg-stone-950 flex items-center justify-center text-white">
            Loading preview...
        </div>;
    }
    const handlePublish = () => {
        console.log("Confirmed & Published Data:", previewData);
        toast.success("Property Published Successfully!");
        router.push("/dashboard");

    }

    console.log("preview data", previewData)
    return (
        <div className="min-h-screen bg-stone-950 text-white overflow-x-hidden">


            <div className="max-w-7xl mx-auto px-4 py-1 lg:px-8 lg:py-2">
                {/* Main Image Swiper */}
                <div className="relative rounded-3xl overflow-hidden">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        navigation={{
                            prevEl: '.custom-prev',
                            nextEl: '.custom-next',
                        }}
                        pagination={{ clickable: true }}
                        loop={(previewData?.images?.length || 0) > 1}
                        className="aspect-video lg:aspect-auto"
                    >
                        {previewData.images.map((img: any, i: any) => (
                            <SwiperSlide key={i}>
                                <Image
                                    src={img}
                                    alt={`Property image ${i + 1}`}
                                    width={1320}
                                    height={500}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                />
                            </SwiperSlide>
                        ))}

                        {/* Custom Navigation Arrows */}
                        <button className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-neutral-800/40 cursor-pointer rounded-full p-3 shadow-lg transition">
                            <ChevronLeft className="w-8 h-8 text-white" />
                        </button>
                        <button className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-neutral-800/40 rounded-full cursor-pointer p-3 shadow-lg transition">
                            <ChevronRight className="w-8 h-8 text-white" />
                        </button>
                    </Swiper>

                    {/* Golden Visa Badge */}
                    <div className="absolute top-6 left-6 z-10">
                        <div className="bg-linear-to-b from-amber-200 to-yellow-600 rounded-lg px-4 py-6 shadow-xl">
                            <p className="text-black text-xs font-bold text-center leading-tight">
                                Golden<br />Visa<br />Eligible
                            </p>
                        </div>
                    </div>
                    <div className="absolute top-6 right-6 z-10">
                        <div className="bg-linear-to-b from-green-800 to-green-900 rounded-lg px-6 py-2 shadow-xl">
                            <p className="text-lg text-center leading-tight flex flex-col">
                                <span className='flex items-center gap-x-1'>
                                    <Verified />
                                    REGA</span> <span>
                                    VERIFIED
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="absolute top-0 z-10 w-full">
                        <div className="flex items-center justify-between bg-linear-to-b from-green-600 to-green-900 px-16 py-2 shadow-xl">
                            <div className='flex items-center gap-2'>
                                <div>
                                    <CircleAlert />
                                </div>
                                <div>
                                    <p className='text-sm'>Preview Mode</p>
                                    <p className='text-xs'>This is a preview. Your listing is not yet visible to buyers.</p>

                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Button
                                    variant="ghost"
                                    className="bg-white text-black hover:bg-emerald-800/50"
                                    onClick={() => router.back()} // Back to AddPropertyModal
                                >
                                    <Edit className="mr-2 h-5 w-5" />
                                    Back to Edit
                                </Button>
                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-500 gap-2"
                                    onClick={handlePublish}
                                >
                                    <CircleCheckBig />
                                    Confirm & Publish
                                </Button>

                                <Button
                                    onClick={() => router.push("/dashboard")} // Cross → সব বন্ধ + ড্যাশবোর্ডে
                                    className="text-white bg-emerald-500"
                                >
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Heart Icon */}
                    <button className="absolute bottom-6 right-6 bg-green-600 rounded-full p-4 shadow-2xl hover:bg-green-700 transition z-10">
                        <Heart className="w-8 h-8 text-red-600 fill-red-600" />
                    </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-7">
                    {/* Left Side - Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Price, Size, ROI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Card className="bg-stone-900 border-white/10 p-4 text-center">
                                <p className="text-zinc-400 text-sm">Price</p>
                                <p className="text-2xl font-light mt-1">{previewData?.price}</p>
                            </Card>
                            <Card className="bg-stone-900 border-white/10 p-4 text-center">
                                <p className="text-zinc-400 text-sm">Size</p>
                                <p className="text-2xl font-light mt-1">{previewData?.sizeM2}</p>
                                <p className="text-zinc-500 text-sm">{previewData?.sizeSqft}</p>
                            </Card>
                            <Card className="bg-stone-900 border-white/10 p-4 text-center">
                                <p className="text-zinc-400 text-sm">ROI</p>
                                <p className="text-emerald-500 text-2xl font-light mt-1">{previewData?.roi}</p>
                                <p className="text-zinc-500 text-sm">Annual</p>
                            </Card>
                        </div>

                        {/* Title & Location */}
                        <div className='border p-2 bg-stone-900/60 rounded-xl'>
                            <h1 className="text-3xl font-light">{previewData?.title}</h1>
                            <div className="flex items-center gap-2 mt-2 text-gray-400">
                                <MapPin className="w-4 h-4" />
                                <p>{previewData?.location}</p>
                            </div>
                        </div>

                        <Card className="bg-stone-900/60 border-white/10 shadow-xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-linear-to-b from-emerald-500 to-emerald-900 rounded-full flex items-center justify-center shadow-lg">
                                    <CreditCard className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-xl">Payment Plan & Milestones</h2>
                            </div>

                            {/* Ready to Move / Off-Plan  */}
                            <Tabs defaultValue="ready" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-stone-800/50 h-14 rounded-xl p-1">
                                    <TabsTrigger value="ready" className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white rounded-lg">
                                        <CircleCheckBig className="w-5 h-5 mr-2" />
                                        Ready to Move
                                    </TabsTrigger>
                                    <TabsTrigger value="offplan" className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white rounded-lg">
                                        Off-Plan
                                    </TabsTrigger>
                                </TabsList>

                                {/* Ready to Move Content*/}
                                <TabsContent value="ready" className="mt-6">
                                    <Card className="bg-emerald-800/10 border-emerald-800/30 p-6">
                                        <div className="flex items-start gap-4">
                                            <CircleCheckBig className="w-8 h-8 text-emerald-500 mt-1" />
                                            <div>
                                                <p className="font-medium">Property Ready for Immediate Move-In</p>
                                                <p className="text-sm text-gray-400 mt-1">Full payment or bank financing options available</p>
                                            </div>
                                        </div>
                                    </Card>
                                </TabsContent>

                                {/* Off-Plan Content */}
                                <TabsContent value="offplan" className="mt-6 space-y-6">
                                    <Card className="bg-emerald-800/10 border-emerald-800/30 p-6">
                                        <div className="flex items-start gap-4">
                                            <CircleCheckBig className="w-8 h-8 text-emerald-500 mt-1" />
                                            <div>
                                                <p className="font-medium">Property Ready for Immediate Move-In</p>
                                                <p className="text-sm text-gray-400 mt-1">Full payment or bank financing options available</p>
                                            </div>
                                        </div>
                                    </Card>
                                    {/*Payment Progress*/}
                                    <Card className="bg-neutral-900/70 border border-white/5 rounded-2xl shadow-xl">
                                        <CardHeader className="">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-yellow-500/20 rounded-full flex items-center justify-center shadow-md">
                                                    <CreditCard className="w-5 h-5 text-yellow-400" />
                                                </div>
                                                <CardTitle className="text-lg">Payment Distribution</CardTitle>
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="space-y-2">
                                                {/* Payment Progress title + amount */}
                                                <div className="flex justify-between items-baseline">
                                                    <p className="text-base text-gray-300">Payment Progress</p>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-400">Total Paid </p>
                                                        <p className="text-yellow-400 text-xl font-bold">SAR 1,200,000
                                                            <span className="text-sm text-gray-400">/SAR 4,000,000 </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <Progress value={20} className="h-4.5 bg-green-200/50 rounded-full overflow-hidden">
                                                    <div className="h-full w-full flex items-center justify-start">
                                                        <div className="h-full w-[20%] bg-linear-to-r from-emerald-600 via-emerald-500 to-emerald-400 rounded-full relative flex items-center justify-center">
                                                            <span className="text-green-900 font-bold absolute">20%</span>
                                                        </div>
                                                    </div>
                                                    <ProgressIndicator
                                                        className="absolute left-[20%] -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-neutral-900"
                                                        style={{ transition: 'left 0.4s ease' }}
                                                    >
                                                        <div className="w-7 h-7 bg-emerald-500 rounded-full"></div>
                                                    </ProgressIndicator>
                                                </Progress>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Off-Plan Payment Schedule*/}
                                    <Card className="bg-stone-900/60 border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                                        <CardHeader className="px-3">
                                            <CardTitle className="text-xl font-normal">Off-Plan Payment Schedule</CardTitle>
                                        </CardHeader>

                                        <CardContent className="px-2 pb-1 space-y-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {/* Total Price */}
                                                <Card className="bg-stone-900 border-white/10 rounded-2xl p-4">
                                                    <CardContent className="p-0 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="w-5 h-5 text-emerald-800" />
                                                            <p className="text-xs text-white">Total Price</p>
                                                        </div>
                                                        <p className="text-lg font-normal text-white">SAR 4,200,000</p>
                                                    </CardContent>
                                                </Card>

                                                {/* Verified Payments */}
                                                <Card className="bg-emerald-800/10 border-emerald-800/30 rounded-2xl p-4">
                                                    <CardContent className="p-0 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="w-5 h-5 text-emerald-800" />
                                                            <p className="text-xs text-white">Verified Payments</p>
                                                        </div>
                                                        <p className="text-xl font-normal text-emerald-800">0 / 7</p>
                                                    </CardContent>
                                                </Card>

                                                {/* Pending Review */}
                                                <Card className="bg-yellow-400/10 border-yellow-400 rounded-xl p-4">
                                                    <CardContent className="p-0 space-y-2">
                                                        <div className="flex items-center gap-3">
                                                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                                                            <p className="text-xs text-white">Pending Review</p>
                                                        </div>
                                                        <p className="text-xl font-normal text-yellow-400">1</p>
                                                    </CardContent>
                                                </Card>

                                                {/* Construction Progress */}
                                                <Card className="bg-stone-900 border-white/10 rounded-2xl p-4">
                                                    <CardContent className="p-0 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Image
                                                                src={'/property-svg.svg'}
                                                                alt='property'
                                                                height={20}
                                                                width={20}
                                                            />
                                                            <p className="text-xs text-white">Construction Progress</p>
                                                        </div>
                                                        <p className="text-xl font-normal text-white">10%</p>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* Payment Progress + 0% Complete with shadcn Progress */}
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm text-gray-400">Payment Progress</p>
                                                    <p className="text-base text-white">0%</p>
                                                </div>

                                                <div className="h-12 bg-transparent border border-white/10 rounded-xl overflow-hidden relative flex items-center justify-center gap-x-2">
                                                    <Award />
                                                    <p className="text-lg font-normal text-white"> 0% Complete</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <div className="rounded-md space-y-4">
                                        {/* Milestones */}
                                        <div className="space-y-4">

                                            {offPlanMilestones.map((milestone) => (
                                                <Card
                                                    key={milestone.step}
                                                    className={`bg-stone-900/70 border 
                                                        ${milestone.active ? 'border-yellow-500/50' : 'border-white/10'} rounded-2xl p-6 
                                                        ${milestone.active ? '' : 'opacity-70'}`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-4 relative">
                                                            <div className="flex items-start gap-6 relative pl-2">
                                                                {/* Circle with number / icon */}
                                                                <div className="relative shrink-0">
                                                                    {milestone.active ? (
                                                                        <>
                                                                            {/* glowing circle + exclamation icon */}
                                                                            <div className={` w-12 h-12 rounded-full flex items-center justify-center ${milestone.active ? "w-8 h-8 relative bg-yellow-300 rounded-full shadow-2xl overflow-hidden" : 'bg-linear-to-br from-white/30 to-black/0'}`}>
                                                                                <AlertCircle className="w-7 h-7 text-black" />
                                                                            </div>
                                                                            {/* Small number badge bottom-right */}
                                                                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-black rounded-full shadow-2xl border border-gray-700 flex items-center justify-center">
                                                                                <span className="text-white text-sm font-bold">{milestone.step}</span>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {/*lock icon */}
                                                                            <div className="w-14 h-14 bg-linear-to-br from-white/30 to-black/0 rounded-full flex items-center justify-center relative">
                                                                                <Lock className="w-8 h-8 text-gray-400" />
                                                                            </div>
                                                                            {/* Small number badge bottom-right */}
                                                                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-black rounded-full shadow-2xl border border-gray-700 flex items-center justify-center">
                                                                                <span className="text-gray-400 text-sm font-bold">{milestone.step}</span>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium text-lg">{milestone.title}</h4>
                                                                    <p className="text-sm text-gray-400 mt-1">{milestone.desc}</p>
                                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                                                                        <div className=' border py-2 pl-2 rounded-md bg-[#12121266]'>
                                                                            <p className="text-sm text-gray-400 flex items-center gap-x-1"> <span className='text-xs'><FaDollarSign /></span> Amount</p>
                                                                            <p className=" text-white">{milestone.amount}</p>
                                                                        </div>
                                                                        <div className=' border py-2 px-2 rounded-md bg-[#12121266]'>
                                                                            <p className="text-sm text-gray-500">Construction</p>
                                                                            <p className="font-bold text-emerald-400">{milestone.construction}</p>
                                                                        </div>
                                                                        <div className=' border py-2 px-4 rounded-md bg-[#12121266] '>
                                                                            <p className="text-sm text-gray-500">Due Date</p>
                                                                            <p className="font-bold flex items-center gap-2">
                                                                                <Calendar className="w-4 h-4" />
                                                                                {milestone.dueDate}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {milestone.actionRequired && (
                                                            <Badge className="bg-yellow-700/20 border border-yellow-700/40 text-yellow-500 px-4 py-2 rounded-full flex items-center gap-2">
                                                                <Sparkles className="w-4 h-4" />
                                                                Action Required
                                                            </Badge>
                                                        )}
                                                        {!milestone.active && milestone.step > 1 && (
                                                            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                                                                <Lock className="w-4 h-4 mr-1" />
                                                                Locked
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>

                                        {/* REGA Verified Footer */}
                                        <div className="border p-4 rounded-md border-white/10 flex items-center gap-3">

                                            <div className='bg-emerald-700/30 p-2 rounded-full'>
                                                <Shield className="w-6 h-6 text-emerald-700" />
                                            </div>
                                            <div>
                                                <p className="text-sm">REGA Verified Payment Plan</p>
                                                <p className='text-xs text-gray-400'>All milestones monitored by Saudi Real Estate General Authority</p>
                                            </div>
                                        </div>

                                        <Button className="w-full  bg-emerald-700 hover:bg-emerald-800 h-14 text-lg rounded-xl shadow-lg">
                                            <CircleCheckBig className="" />
                                            Accept this Payment Plan & Proceed
                                        </Button>

                                        <p className="text-center text-xs text-gray-500">
                                            All transactions protected by Saudi Real Estate Authority (REGA) laws
                                        </p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </Card>

                        {/* About This Property */}
                        <Card className="bg-stone-900 border-white/10 p-6">
                            <h2 className="text-lg mb-4">About This Property</h2>
                            <p className="text-gray-400 text-base leading-relaxed whitespace-pre-line">
                                {previewData?.description}
                            </p>
                        </Card>

                        {/* Investment Analysis */}
                        <Card className="bg-neutral-800 border-white/10 p-6">
                            <h2 className="text-lg mb-6">Investment Analysis</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-neutral-700 rounded-lg px-4 py-4">
                                    <p>Est. Monthly Rent</p>
                                    <p className="font-medium">{previewData?.monthlyRent}</p>
                                </div>
                                <div className="flex justify-between items-center bg-neutral-700 rounded-lg px-4 py-4">
                                    <p>Annual Return</p>
                                    <p className="font-medium text-emerald-500">{previewData?.annualReturn}</p>
                                </div>
                                <div className="flex justify-between items-center bg-neutral-700 rounded-lg px-4 py-4">
                                    <p>Value Appreciation</p>
                                    <p className="font-medium text-yellow-400">{previewData?.appreciation}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Side - Location & Nearby */}
                    <div className="space-y-6">
                        {/* Location & Proximity */}
                        <Card className="bg-stone-900 border-white/10 p-6">
                            <h3 className="text-base mb-4">Location & Proximity</h3>
                            <div className="bg-zinc-800 rounded-xl overflow-hidden mb-4">
                                <Image
                                    src={previewData?.mapImage}
                                    alt="Location map"
                                    width={505}
                                    height={346}
                                    className="w-full h-auto"
                                    unoptimized
                                />
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <MapPin className="w-4 h-4 text-emerald-500" />
                                <p className="text-sm">Diriyah UNESCO Heritage Zone</p>
                            </div>
                        </Card>

                        {/* Nearby Giga-Projects */}
                        <Card className="bg-neutral-800 border-neutral-800 p-4">
                            <h3 className="text-base">Nearby Giga-Projects</h3>
                            <div className="flex items-center gap-x-3">
                                <div className="w-2 h-2 bg-emerald-800 rounded-full opacity-50" />
                                <div>
                                    <p className="font-medium">New Murabba</p>
                                    <p className="text-sm text-gray-400">12 mins to New Murabba (Mukaab)</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Bottom Fixed Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur border-t border-white/10 px-4 py-4 lg:px-14">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-xl font-bold">SAR 4,100,000</p>
                        <div className="flex gap-3">
                            <Button variant="outline" size="lg" className="rounded-full px-6 border-white/10">
                                <Heart className="w-5 h-5 mr-2" />
                                Save
                            </Button>
                            <Button size="lg" className="bg-emerald-800 hover:bg-emerald-700 rounded-full px-8">
                                <Check className="w-5 h-5 mr-2" />
                                Contact Agent
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyPreviewClient;