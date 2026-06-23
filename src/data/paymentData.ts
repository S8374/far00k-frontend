type PaymentItem = {
    id: number;
    title: string;
    subtitle: string;
    image: string;
    paid: number;
    total: number;
    percentage: number;
};
export const paymentData: PaymentItem[] = [
    {
        id: 1,
        title: "Elite 3BR Villa - Al Malqa",
        subtitle: "Elite Villa",
        image: "/br-villa.png",
        paid: 1200000,
        total: 4000000,
        percentage: 10,
    },
    {
        id: 1,
        title: "Elite 3BR Villa - Al Malqa",
        subtitle: "Elite Villa",
        image: "/br-villa.png",
        paid: 1200000,
        total: 4000000,
        percentage: 20,
    },
    {
        id: 1,
        title: "Elite 3BR Villa - Al Malqa",
        subtitle: "Elite Villa",
        image: "/br-villa.png",
        paid: 1200000,
        total: 4000000,
        percentage: 30,
    },
];