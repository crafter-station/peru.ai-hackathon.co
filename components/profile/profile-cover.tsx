import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProfileCover() {
  return (
    <div
      className={cn(
        "aspect-2/1 border-x border-edge select-none sm:aspect-3/1",
        "flex items-center justify-center text-foreground",
        "screen-line-before screen-line-after before:-top-px after:-bottom-px",
        "bg-background dither-bg"
      )}
    >
      <div className="h-1/5 w-auto flex items-center justify-center">
        <Image
          src="/thc.svg"
          alt="THC"
          width={374}
          height={29}
          className="h-full w-auto"
        />
      </div>
    </div>
  );
}

