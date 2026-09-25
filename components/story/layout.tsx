import type { ReactNode } from "react";

/** Horizontal frame shared by all chapters: leaves room for the path rail on xl. */
export function Frame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1600px] px-4 sm:px-6 xl:pl-[200px] ${className}`}>{children}</div>;
}

/**
 * One scroll step. On phones the card sits low so the model shows above it;
 * on wider screens it is vertically centred in the left column.
 */
export function Step({
  scene,
  force,
  children,
  id,
  labelledBy,
  tall = false,
}: {
  scene: string;
  force?: string;
  children: ReactNode;
  id?: string;
  labelledBy?: string;
  tall?: boolean;
}) {
  return (
    <div
      id={id}
      data-scene={scene}
      data-force={force}
      aria-labelledby={labelledBy}
      className={`flex ${tall ? "min-h-[130svh]" : "min-h-[100svh]"} items-end pb-[6svh] pt-[calc(var(--header-h)+38svh)] md:items-center md:py-[14svh]`}
    >
      <Frame>
        <div className="w-full max-w-[520px]">{children}</div>
      </Frame>
    </div>
  );
}
