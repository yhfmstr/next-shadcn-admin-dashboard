"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const RequestSchema = z.object({
  phone: z.string().min(8, { message: "Enter phone with country code, e.g. +15551234567" }),
});

const VerifySchema = z.object({
  phone: z.string().min(8),
  token: z.string().min(4, { message: "Enter the 4-8 digit code" }),
});

export function PhoneOtpForm({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  const [otpRequested, setOtpRequested] = useState(false);
  const [phoneForVerify, setPhoneForVerify] = useState("");
  const requestForm = useForm<z.infer<typeof RequestSchema>>({
    resolver: zodResolver(RequestSchema),
    defaultValues: { phone: "" },
  });
  const verifyForm = useForm<z.infer<typeof VerifySchema>>({
    resolver: zodResolver(VerifySchema),
    defaultValues: { phone: "", token: "" },
  });

  const handleRequest = async (data: z.infer<typeof RequestSchema>) => {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithOtp({
      phone: data.phone,
      options: {
        channel: "sms",
        shouldCreateUser: true,
      },
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setOtpRequested(true);
    setPhoneForVerify(data.phone);
    verifyForm.setValue("phone", data.phone);
    toast.success("OTP sent via SMS");
  };

  const handleVerify = async (data: z.infer<typeof VerifySchema>) => {
    const supabase = createBrowserSupabaseClient();
    const { data: verifyData, error } = await supabase.auth.verifyOtp({
      phone: data.phone,
      token: data.token,
      type: "sms",
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    if (verifyData.session) {
      toast.success("Logged in");
      window.location.assign(redirectTo);
    }
  };

  return (
    <div className="space-y-4">
      {!otpRequested ? (
        <Form {...requestForm}>
          <form onSubmit={requestForm.handleSubmit(handleRequest)} className="space-y-4">
            <FormField
              control={requestForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="+15551234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Send code
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...verifyForm}>
          <form onSubmit={verifyForm.handleSubmit(handleVerify)} className="space-y-4">
            <FormField
              control={verifyForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="+15551234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={verifyForm.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification code</FormLabel>
                  <FormControl>
                    <Input placeholder="1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Verify and continue
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}



