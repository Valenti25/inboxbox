import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useEffect, useState } from "react";

const mockCarouselData = [
  {
    title: "Detail Feature #1",
    image: "/images/login-carousel-1.svg",
    description:
      "(1) ให้คุณจัดการทุกการสนทนาจาก LINE, Facebook, Instagram, WhatsApp ในแอปเดียว",
  },
  {
    title: "Detail Feature #2",
    image: "/images/login-carousel-1.svg",
    description:
      "(2) ให้คุณจัดการทุกการสนทนาจาก LINE, Facebook, Instagram, WhatsApp ในแอปเดียว",
  },
  {
    title: "Detail Feature #3",
    image: "/images/login-carousel-1.svg",
    description:
      "(3) ให้คุณจัดการทุกการสนทนาจาก LINE, Facebook, Instagram, WhatsApp ในแอปเดียว",
  },
];

function CustomCarousel() {
  const [api, setApi] = useState<CarouselApi | null>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setSlideCount(api.scrollSnapList().length);
    setCurrentSlide(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="h-full flex flex-col gap-3 font-thai">
      <Carousel opts={{ loop: true }} setApi={setApi} className="h-full [&>div]:h-full">
        <CarouselContent className="h-full">
          {mockCarouselData.map((item, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="space-y-6 flex flex-1 flex-col">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={0}
                  height={0}
                  className="h-auto object-contain w-full max-w-xl mx-auto"
                />
                <div className="text-white space-y-2 text-left">
                  <Label className="text-3xl font-semibold">{item.title}</Label>
                  <Label className="text-sm">
                    {item.description}
                  </Label>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex gap-2 mt-3">
        {Array.from({ length: slideCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default CustomCarousel;
