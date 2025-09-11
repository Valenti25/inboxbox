"use client";

import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

export const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "กรุณากรอกอีเมล" })
    .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "รูปแบบอีเมลไม่ถูกต้อง",
    }),
  password: z.string().min(1, { message: "กรุณากรอกรหัสผ่าน" }),
});

export type FormValues = z.infer<typeof formSchema>;

type LoginFormProps = {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
  hideForm?: boolean;
};

function LoginForm({ form, onSubmit, hideForm = false }: LoginFormProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // mock
    setLoading(false);
    onSubmit(values);
  };

  const inputBaseClass =
  "h-11 w-full rounded-xl border-2 bg-white px-3 text-sm " +
  "placeholder:text-muted-foreground/70 transition-colors " +
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:border-[#F24822]/90 focus-visible:ring-[#F24822]/20 " +
  "aria-[invalid=true]:border-[#E7000B]/90 aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-[#E7000B]/20";

  return (
    <div className="font-thai flex flex-col justify-between h-full lg:gap-0 gap-6">
      <div className="space-y-6">
        <div className="flex flex-col lg:gap-0 gap-2">
          <Label
            className={cn(
              "lg:text-3xl font-bold text-gray-800 lg:mb-3 mb-0 lg:mx-0",
              "text-2xl mx-auto"
            )}
          >
            เริ่มต้นใช้งาน
          </Label>
          <p className="text-sm text-[#736862] ">
            ให้คุณจัดการทุกการสนทนาจาก
            <br /> LINE, Facebook, Instagram, WhatsApp{" "}
            <span className="text-[#F24822]">ในแอปเดียว</span>
          </p>
        </div>

        <AnimatePresence>
          {!hideForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden p-1"
            >
              <Form {...form}>
                <form
                  className="space-y-4 w-full text-start"
                  onSubmit={form.handleSubmit(handleSubmit)}
                >
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => {
                      const { error } = form.getFieldState(
                        "email",
                        form.formState
                      );
                      return (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="อีเมล"
                                aria-invalid={!!error}
                                className={cn(inputBaseClass, "pr-9")}
                                {...field}
                              />
                              {field.value && (
                                <button
                                  type="button"
                                  onClick={() => field.onChange("")}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center size-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                                  aria-label="ล้างค่าอีเมล"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage className="text-[#E7000B] text-sm mt-1" />
                        </FormItem>
                      );
                    }}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => {
                      const { error } = form.getFieldState(
                        "password",
                        form.formState
                      );
                      return (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="รหัสผ่าน"
                                type="password"
                                aria-invalid={!!error}
                                className={cn(inputBaseClass)}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[#E7000B] text-sm mt-1" />
                        </FormItem>
                      );
                    }}
                  />

                  {/* Submit */}
                  <Button
                    variant="default"
                    className="w-full h-10 text-white font-bold hover:bg-[#F24822]/80 transition-colors"
                    type="submit"
                    isLoading={loading}
                  >
                    เข้าสู่ระบบ
                  </Button>

                  {/* Divider */}
                  <div className="flex items-center">
                    <Separator className="flex-1 bg-secondary" />
                    <span className="px-4 text-muted-foreground">หรือ</span>
                    <Separator className="flex-1 bg-secondary" />
                  </div>

                  {/* Login with LINE */}
                  <Button
                    variant="default"
                    type="button"
                    className="w-full h-10 text-sm bg-[#06C755] text-white font-semibold flex items-center justify-center gap-2 hover:brightness-95"
                    onClick={form.handleSubmit(handleSubmit)}
                  >
                    <Image src="/line.svg" alt="LINE" width={25} height={25} />
                    เข้าสู่ระบบด้วย LINE
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mx-auto">
        <Label className="text-[#1B71F5] text-sm">Privacy Policy</Label>
        <Separator orientation="vertical" className="h-6! bg-secondary" />
        <Label className="text-[#1B71F5] text-sm">Term &amp; Condition</Label>
      </div>
    </div>
  );
}

export default LoginForm;
