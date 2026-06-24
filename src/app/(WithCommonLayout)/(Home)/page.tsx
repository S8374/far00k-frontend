/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Banner from "@/components/modules/home/Banner";
import DeveloperProjects from "@/components/modules/home/DeveloperProjects";
import FeaturedProperties from "@/components/modules/home/FeaturedProperties";
import Footer from "@/components/modules/home/Footer";
import GigaProjects from "@/components/modules/home/GigaProjects";
import Services from "@/components/modules/home/Services";
import Subscribe from "@/components/modules/home/Subscribe";
import Verify from "@/components/modules/home/Verify";
import { CategoryItem } from "@/components/shared/NavCategory";
import { HomeSearchFilters } from "@/components/shared/Navbar";
import {
  PropertySearchParams,
  useGetAllPropertiesQuery,
  useGetPropertyCategoriesQuery,
} from "@/redux/api/propertyApi";
import { useMemo, useState } from "react";

interface ApiProperty {
  id: string;
  title: string;
  price: number;
  createdAt?: string;
  currency?: string;
  location?: string;
  addressLine?: string;
  listingPurpose?: "SELL" | "RENT";
  areaSqm?: number;
  roiProjectionPercent?: number;
  isRegaVerified?: boolean;
  images?: string[];
  media?: Array<{ url?: string }>;
  latitude?: number;
  longitude?: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  GOLDEN_VISA: "/golden-visa.svg",
  HIGH_YIELD: "/high-yeld.svg",
  GIGA_PROJECT: "/giga-projects.svg",
};

const DEFAULT_FILTERS: HomeSearchFilters = {
  location: "",
  search: "",
  minPrice: "",
  maxPrice: "",
  listingPurpose: "",
  timeFilter: "",
};
const DEFAULT_CATEGORY = "allproperties";

const toCategoryLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const parseNumber = (value: string) => {
  if (!value.trim()) return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const areFiltersEqual = (a: HomeSearchFilters, b: HomeSearchFilters) =>
  a.location === b.location &&
  a.search === b.search &&
  a.minPrice === b.minPrice &&
  a.maxPrice === b.maxPrice &&
  a.listingPurpose === b.listingPurpose &&
  a.timeFilter === b.timeFilter;

const extractApiProperties = (response: any): ApiProperty[] => {
  const rawPropertyPayload = response?.data?.data;

  if (Array.isArray(rawPropertyPayload)) {
    return rawPropertyPayload;
  }

  if (Array.isArray(rawPropertyPayload?.data)) {
    return rawPropertyPayload.data;
  }

  return [];
};

const mapPropertyToCard = (property: ApiProperty) => {
  const images: string[] = property.images?.length
    ? property.images
    : (property.media
        ?.map((item) => item.url)
        .filter((url): url is string => typeof url === "string" && url.length > 0) ?? []);

  return {
    id: property.id,
    createdAt: property.createdAt,
    title: property.title,
    price: `${property.currency || "SAR"} ${Number(property.price || 0).toLocaleString()}`,
    subtitle: [property.location || property.addressLine, property.listingPurpose]
      .filter(Boolean)
      .join(" • "),
    roi: property.roiProjectionPercent ? `${property.roiProjectionPercent}% ROI` : "",
    area: property.areaSqm ? `${property.areaSqm} m2` : "",
    badge: property.isRegaVerified ? "REGA VERIFIED" : undefined,
    verified: Boolean(property.isRegaVerified),
    trophy: false,
    images,
    latitude: property.latitude,
    longitude: property.longitude,
  };
};

import AboutUs from "@/components/modules/home/AboutUs";
import FAQ from "@/components/modules/home/FAQ";
import ContactUs from "@/components/modules/home/ContactUs";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const [filters, setFilters] = useState<HomeSearchFilters>(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] = useState<HomeSearchFilters>(DEFAULT_FILTERS);

  const queryParams = useMemo<PropertySearchParams>(() => {
    return {
      type: selectedCategory,
      location: activeFilters.location,
      search: activeFilters.search,
      listingPurpose: activeFilters.listingPurpose || undefined,
      minPrice: parseNumber(activeFilters.minPrice),
      maxPrice: parseNumber(activeFilters.maxPrice),
      timeFilter: activeFilters.timeFilter || undefined,
    };
  }, [activeFilters, selectedCategory]);

  const { data: allPropertiesResponse, refetch, isLoading: isPropertiesLoading, isFetching: isPropertiesFetching } = useGetAllPropertiesQuery(queryParams);
  const {
    data: categoriesResponse,
    isLoading: isCategoriesLoading,
    isFetching: isCategoriesFetching,
  } = useGetPropertyCategoriesQuery(undefined);

  const apiProperties = useMemo<ApiProperty[]>(
    () => extractApiProperties(allPropertiesResponse),
    [allPropertiesResponse],
  );

  const filteredProperties = useMemo(
    () => apiProperties.map(mapPropertyToCard),
    [apiProperties],
  );

  const categoryItems = useMemo<CategoryItem[]>(() => {
    const rawCategoryPayload = categoriesResponse?.data?.data;
    const backendCategories = Array.isArray(rawCategoryPayload)
      ? rawCategoryPayload
      : Array.isArray(rawCategoryPayload?.data)
        ? rawCategoryPayload.data
        : [];

const dynamicCategories: CategoryItem[] = backendCategories
  .filter((category: { type: string }) => category.type !== "OFF_PLAN" && category.type !== "MAKKAH" && category.type !== "MADINAH")
  .map((category: { type: string; count: number }) => ({
    label: toCategoryLabel(category.type),
    value: category.type,
    count: category.count,
    icon: CATEGORY_ICONS[category.type],
  }));

    const allCount = dynamicCategories.reduce(
      (total, item) => total + (item.count || 0),
      0,
    );

    return [
      {
        label: "All Properties",
        value: "allproperties",
        count: allCount,
      },
      ...dynamicCategories,
    ];
  }, [categoriesResponse]);
// changed
  const handleFilterChange = (nextFilters: Partial<HomeSearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...nextFilters }));
  };

  const handleSearchSubmit = () => {
    if (areFiltersEqual(filters, activeFilters)) {
      refetch();
      return;
    }

    setActiveFilters(filters);
  };

  // New add somting

  const handleClearFilters = () => {
    const resetFilters: HomeSearchFilters = { ...DEFAULT_FILTERS };

    setSelectedCategory(DEFAULT_CATEGORY);

    if (areFiltersEqual(activeFilters, DEFAULT_FILTERS)) {
      setFilters(resetFilters);
      refetch();
      return;
    }

    setFilters(resetFilters);
    setActiveFilters({ ...DEFAULT_FILTERS });
  };

  return (
    <div className="">
      <Banner
        selectedCategory={selectedCategory}
        properties={filteredProperties}
        setSelectedCategory={setSelectedCategory}
        categories={categoryItems}
        isCategoriesLoading={isCategoriesLoading || isCategoriesFetching}
        filters={filters}
        onFiltersChange={handleFilterChange}
        onSearchSubmit={handleSearchSubmit}
        onClearFilters={handleClearFilters}
        isLoading={isPropertiesLoading || isPropertiesFetching}
      />
      <Services />
      <FeaturedProperties />
      <GigaProjects />
      <DeveloperProjects />
      <Verify />
      <AboutUs />
      <FAQ />
      <ContactUs />
      <Subscribe />
      <Footer />
    </div>
  );
};

export default HomePage;