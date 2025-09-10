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
    .min(1, {
      message: "กรุณากรอกอีเมล",
    })
    .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "รูปแบบอีเมลไม่ถูกต้อง",
    }),
  password: z.string().min(1, {
    message: "กรุณากรอกรหัสผ่าน",
  }),
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
    // mock loading
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    onSubmit(values);
  };
  return (
    <div className="font-thai flex flex-col justify-between h-full lg:gap-0 gap-6">
      <div className="space-y-6">
        <div className="flex flex-col lg:gap-0 gap-2">
          <Label
            className={cn(
              "lg:text-3xl font-bold text-gray-800 lg:mb-3 mb-0 lg:mx-0",
              "text-2xl mx-auto",
            )}
          >
            เริ่มต้นใช้งาน
          </Label>
          <p className="text-sm text-[#736862] ">
            ให้คุณจัดการทุกการสนทนาจาก<br /> LINE, Facebook, Instagram, WhatsApp{" "}
            <span className="text-primary">ในแอปเดียว</span>
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
                  {/* Form Fields... */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="อีเมล" clearAble {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="รหัสผ่าน"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="default"
                    className={cn(
                      "w-full  text-white font-bold hover:bg-primary/80 transition-colors",
                    )}
                    type="submit"
                    isLoading={loading}
                  >
                    เข้าสู่ระบบ
                  </Button>
                  <div className="flex items-center">
                    <Separator className="flex-1 bg-secondary" />
                    <span className="px-4 text-muted-foreground">หรือ</span>
                    <Separator className="flex-1 bg-secondary" />
                  </div>
                  <Button
                    variant="default"
                    type="submit"
                    className={cn(
                      "w-full text-sm bg-[#06C755] text-white font-semibold flex items-center justify-center gap-2",
                    )}
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
        <Label className="text-[#1B71F5] text-sm">
          Privacy Policy
        </Label>
        <Separator orientation="vertical" className="h-6! bg-secondary" />
        <Label className="text-[#1B71F5] text-sm">
          Term & Condition
        </Label>
      </div>
    </div>
  );
}

export default LoginForm;
