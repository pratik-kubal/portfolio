// app/components/ui/button.tsx (or wherever yours lives)
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import gsap from "gsap";

import { cn } from "@/lib/utils";

/* ---------------------------------- */
/* Magnetic hover hook (inline)       */
/* ---------------------------------- */
type MagneticOpts = {
  strength?: number;        // 0.1–0.5 = subtle/strong
  radius?: number;          // px distance to start pulling
  disableOnTouch?: boolean; // skip on touch devices
};

function useMagnetic(
  ref: React.RefObject<HTMLElement | null>,
  { strength = 0.25, radius = 160, disableOnTouch = true }: MagneticOpts = {}
) {
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect user’s OS reduced-motion preference
    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    if (disableOnTouch && "ontouchstart" in window) return;

    el.style.willChange = "transform";

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const mx = e.clientX - cx;
      const my = e.clientY - cy;

      const dist = Math.hypot(mx, my);
      if (dist > radius) {
        gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "power3.out" });
        return;
      }
      gsap.to(el, {
        x: mx * strength,
        y: my * strength,
        duration: 0.25,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, strength, radius, disableOnTouch]);
}

/* ---------------------------------- */
/* Your existing variants             */
/* ---------------------------------- */
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
  }
);

/* ---------------------------------- */
/* Button component w/ magnetic props */
/* ---------------------------------- */
type BaseProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;

    /** Enable/disable magnetic effect (default: true) */
    magnetic?: boolean;
    /** Magnetic strength (default: 0.28) */
    magneticStrength?: number;
    /** Magnetic radius in px (default: 160) */
    magneticRadius?: number;
    /** Disable magnetic on touch devices (default: true) */
    disableMagneticOnTouch?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, BaseProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      magnetic = true,
      magneticStrength = 0.28,
      magneticRadius = 160,
      disableMagneticOnTouch = true,
      ...props
    },
    forwardedRef
  ) => {
    // We attach magnetic to the rendered element (button or child via Slot).
    const localRef = React.useRef<HTMLElement | null>(null);

    // Run magnetic only if enabled
    useMagnetic(localRef, {
      strength: magnetic ? magneticStrength : 0,
      radius: magneticRadius,
      disableOnTouch: disableMagneticOnTouch,
    });

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        // data-slot is kept as you had it
        data-slot="button"
        // Attach ref for magnetic + also forward the ref if it's a real button
        // When asChild, Radix Slot will forward this ref to the child element.
        ref={((node: HTMLElement | null) => {
          localRef.current = node;
          // If the actual rendered element is a button, also pass it to forwardedRef
          if (typeof forwardedRef === "function") {
            forwardedRef(node as HTMLButtonElement | null);
          } else if (forwardedRef) {
            // best-effort cast when not rendering a real <button>
            // (safe in practice for standard usage)
            (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current =
              (node as HTMLButtonElement | null);
          }
        }) as unknown as React.Ref<HTMLButtonElement>}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
