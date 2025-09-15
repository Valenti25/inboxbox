import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function LoadingSpinner(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21 10.9995C21.5523 10.9996 22 11.4482 22 12.0005L21.9922 12.395C21.9141 14.3674 21.2536 16.2758 20.0898 17.8775C18.8485 19.5859 17.0983 20.8578 15.0898 21.5103C13.0814 22.1628 10.9176 22.1629 8.90918 21.5103C6.90105 20.8577 5.15132 19.5857 3.91016 17.8775C2.66893 16.169 2 14.1113 2 11.9995C2.00002 9.88777 2.66889 7.83006 3.91016 6.1216C5.15141 4.41326 6.90184 3.14135 8.91016 2.48879C10.793 1.87709 12.8121 1.8392 14.7119 2.37453L15.0898 2.48879L15.1855 2.5259C15.6491 2.73038 15.8921 3.2563 15.7324 3.74855C15.5725 4.24085 15.0666 4.52438 14.5713 4.4175L14.4717 4.39113L14.1689 4.29934C12.6491 3.87122 11.0335 3.90173 9.52734 4.39113C7.92085 4.91323 6.52124 5.93081 5.52832 7.29738C4.53531 8.66415 4.00001 10.3101 4 11.9995C4 13.6888 4.53447 15.335 5.52734 16.7017C6.52027 18.0684 7.92076 19.0858 9.52734 19.6079C11.134 20.13 12.865 20.1299 14.4717 19.6079C16.0784 19.0859 17.4786 18.0684 18.4717 16.7017C19.4027 15.4204 19.9317 13.8938 19.9941 12.3159L20 11.9995C20.0002 11.4474 20.4479 10.9995 21 10.9995Z"
        fill="#FAFAFA"
      />
    </svg>
  );
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        "cursor-pointer",
        buttonVariants({ variant, size, className }),
      )}
      {...props}
    >
      {isLoading ? <LoadingSpinner className="animate-spin" /> : children}
    </Comp>
  );
}

export { Button, buttonVariants };
