"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { property } from "@/data/propertyData";
import { Mail, MapPin, Phone } from "lucide-react";
import PropertyMap from "@/components/main/PropertyMap";
import Container from "@/components/shared/Container";

const formSchema = z.object({
  fullName: z.string().min(5, { message: "Name should be atleast 5 character" }),
  email: z.string().email({ message: "Please input right email" }),
  phone: z.string().min(8, { message: "Please input right phone number" }),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactUs() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log("================ FORM DATA ================");
    console.log("Full Name     :", values.fullName);
    console.log("Email         :", values.email);
    console.log("Phone         :", values.phone);
    console.log("Delivery Address :", values.address);
    console.log("Additional Notes :", values.notes);
    console.log("=============================================");
  }

  return (
    <section id="contact-us" className="text-white py-24 bg-stone-950">
      <Container>
        <div className="text-center my-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Connect with Our Licensed Real Estate Experts
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions about Saudi property market? Our REGA-certified
            agents are here to guide you through every step of your digital
            investment journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-stretch mt-10 md:mt-16">
          <div className="col-span-2 border-neutral-500 border rounded-lg p-8 shadow-2xl h-full">
            <h3 className="text-2xl font-semibold mb-8">Send Us a message</h3>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Full name" className="bg-neutral-800" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Email Address" className="bg-neutral-800" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" className="bg-neutral-800" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter delivery address" className="bg-neutral-800" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter any additional requirements or notes" className="bg-neutral-800 min-h-30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-6 text-lg mt-4">
                  Submit Request
                </Button>
              </form>
            </Form>
          </div>

          <div className="flex flex-col justify-between border border-neutral-500 p-8 rounded-lg shadow-2xl h-full gap-6">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Contact Details</h3>
              <div className="space-y-6 text-gray-300">
                <div>
                  <p className="font-medium flex items-center gap-2 mb-1"> <Phone className="text-emerald-500 w-5 h-5" /> Phone</p>
                  <p className="text-lg">+966 456-7890</p>
                </div>
                <div>
                  <p className="font-medium flex items-center gap-2 mb-1"> <Mail className="text-emerald-500 w-5 h-5" /> Email</p>
                  <p className="text-lg">info@diyarestate.com</p>
                </div>
                <div>
                  <p className="font-medium flex items-center gap-2 mb-1"> <MapPin className="text-emerald-500 w-5 h-5" /> Location</p>
                  <p className="text-lg">Riyadh, Saudi Arabia</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="bg-stone-900 border-white/10 p-6">
                <h4 className="text-base mb-4 font-semibold text-white">Location & Proximity</h4>
                <div className="relative bg-zinc-800 rounded-xl overflow-hidden mb-4 h-[250px] w-full">
                  <PropertyMap
                    isMapActive={true}
                    properties={[
                      {
                        id: "contact-office",
                        latitude: 24.735,
                        longitude: 46.619,
                        title: "Diriyah UNESCO Heritage Zone",
                        price: "Our Office",
                        subtitle: "Riyadh, Saudi Arabia",
                      },
                    ]}
                  />
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <p className="text-sm">Diriyah UNESCO Heritage Zone</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
