"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import z from "zod";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

/* ===================== Schema & Types ===================== */
export const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "กรุณากรอกอีเมล" })
    .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "อีเมลไม่ถูกต้อง",
    }),
  password: z.string().min(1, { message: "กรุณากรอกรหัสผ่าน" }),
  remember: z.boolean().optional(),
});
export type FormValues = z.infer<typeof formSchema>;

type LoginFormProps = {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
  hideForm?: boolean;
};

/* ===================== Component ===================== */
function LoginForm({ form, onSubmit, hideForm = false }: LoginFormProps) {
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingLine, setLoadingLine] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFacebook, setLoadingFacebook] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmitEmail = async (values: FormValues) => {
    setLoadingEmail(true);
    await new Promise((r) => setTimeout(r, 500)); // mock
    setLoadingEmail(false);
    onSubmit(values);
  };

  const oauth = async (setLoading: (b: boolean) => void) => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 500));
    } finally {
      setLoading(false);
    }
  };

  const inputBaseClass =
    "h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm " +
    "placeholder:text-[#9CA3AF] transition-[border,box-shadow] " +
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:border-[#F24822]/90 focus-visible:ring-[#F24822]/20 " +
    "aria-[invalid=true]:border-[#E7000B]/90 aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-[#E7000B]/20";

  return (
    <div className="font-thai">
      {/* การ์ดกลางหน้าจอให้ฟอร์มกว้างประมาณภาพ */}
      <div className="mx-auto max-w-[720px]">
        {/* กลุ่มหัวข้อซ้ายบนตามภาพ */}
        <div className="px-6 ">
          <h1 className="text-xl mb-1 lg:text-2xl lg:mb-2 font-semibold text-[#111827]">
            เริ่มต้นใช้งาน
          </h1>
          <p className="text-sm text-[#736862]">
            ให้คุณจัดการทุกการสนทนาจาก<br className="sm:hidden" />
            LINE, Facebook, Instagram และอื่นๆได้
            <span className="text-[#F24822] font-semibold"> ในแอปเดียว</span>
          </p>
        </div>

        {/* ฟอร์ม */}
        <AnimatePresence>
          {!hideForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Form {...form}>
                <form
                  className="px-6 lg:pt-0 pt-4 space-y-4"
                  onSubmit={form.handleSubmit(handleSubmitEmail)}
                >
                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label className="text-xs lg:text-sm font-medium text-[#27272A]">อีเมล</Label>
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
                                  aria-invalid={Boolean(error)}
                                  className={cn(inputBaseClass, "pr-9")}
                                  autoComplete="email"
                                  inputMode="email"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[#E7000B] text-xs mt-1" />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <Label className="text-xs lg:text-sm font-medium text-[#27272A]">รหัสผ่าน</Label>
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
                                  type={showPassword ? "text" : "password"}
                                  aria-invalid={Boolean(error)}
                                  className={cn(inputBaseClass, "pr-10")}
                                  autoComplete="current-password"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword((s) => !s)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center size-7 rounded-md hover:bg-gray-100"
                                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                                >
                                  {showPassword ? (
                                    <Image src="/logo/open.svg" alt="Eye Off" width={20} height={20} />
                                  ) : (
                                    <Image src="/logo/close.svg" alt="Eye Off" width={20} height={20} />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-[#E7000B] text-xs mt-1" />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  {/* Remember + Forgot */}
                  <div className="flex items-center justify-between pt-1">
                    <FormField
                      control={form.control}
                      name="remember"
                      render={({ field }) => (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="remember"
                            checked={!!field.value}
                            onCheckedChange={(v: boolean | "indeterminate") =>
                              field.onChange(!!v)
                            }
                            className={cn(
                              "data-[state=checked]:bg-[#F24822]",
                              "data-[state=checked]:border-[#F24822]",
                              "data-[state=checked]:text-white",
                              "[&_svg]:h-3 [&_svg]:w-3"
                            )}
                          />
                          <label
                            htmlFor="remember"
                            className="text-xs lg:text-sm font-medium text-[#27272A] select-none"
                          >
                            จำการเข้าสู่ระบบไว้
                          </label>
                        </div>
                      )}
                    />
                    <button
                      type="button"
                      className="text-xs lg:text-sm font-medium text-[#1B71F5] hover:underline"
                      aria-label="ลืมรหัสผ่าน"
                    >
                      ลืมรหัสผ่าน ?
                    </button>
                  </div>

                  {/* Submit */}
                  <Button
                    variant="default"
                    className="w-full lg:text-sm h-10 rounded-[12px] text-white font-semibold bg-[#F24822] hover:bg-[#f46044]"
                    type="submit"
                    isLoading={loadingEmail}
                  >
                    เข้าสู่ระบบ
                  </Button>

                  {/* หรือ ดำเนินการต่อด้วย */}
                  <div className="flex items-center gap-3">
                    <Separator className="flex-1 bg-[#F24822]/10" />
                    <span className="px-1.5 font-medium text-xs text-[#71717A]">
                      หรือ ดำเนินการต่อด้วย
                    </span>
                    <Separator className="flex-1 bg-[#F24822]/10" />
                  </div>

                  {/* Social (Google / LINE / Facebook) */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      type="button"
                      variant="secondary"
                      className="size-10 rounded-sm bg-white border hover:bg-gray-50 p-0"
                      onClick={() => oauth(setLoadingGoogle)}
                      isLoading={loadingGoogle}
                    >
                      <Image src="/logo/google.svg" alt="Google" width={22} height={22} />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="size-10 rounded-sm bg-white border hover:bg-gray-50 p-0"
                      onClick={() => oauth(setLoadingLine)}
                      isLoading={loadingLine}
                    >
                      <Image src="/logo/line.svg" alt="LINE" width={24} height={24} />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="size-10 rounded-sm bg-white border hover:bg-gray-50 p-0"
                      onClick={() => oauth(setLoadingFacebook)}
                      isLoading={loadingFacebook}
                    >
                      <Image src="/logo/facebook.svg" alt="Facebook" width={22} height={22} />
                    </Button>
                  </div>

                  {/* ข้อความยอมรับเงื่อนไขตามภาพ */}
                  <p className="text-center lg:text-sm text-xs leading-5 text-[#6B7280] pt-2">
                    เมื่อตัดสินใจดำเนินการต่อ แสดงว่าคุณยอมรับ<br className="sm:hidden" />
                    <button type="button" className="text-[#1B71F5] hover:underline">
                      ข้อกำหนดการใช้งาน
                    </button>
                    และ
                    <button type="button" className="text-[#1B71F5] hover:underline">
                      นโยบายความเป็นส่วนตัว
                    </button>
                  </p>

                  {/* ยังไม่มีบัญชี? ลงทะเบียน */}
                  <div className="text-center pt-1 pb-6">
                    <span className="text-xs lg:text-sm font-medium text-[#71717A]">ยังไม่มีบัญชี? </span>
                    <button
                      type="button"
                      className="text-xs lg:text-sm text-[#F24822] font-medium hover:underline"
                    >
                      ลงทะเบียน
                    </button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default LoginForm;
