export const dynamic = "force-dynamic";

import { homeSections } from "@/lib/pageSections";

export default function Page() {
  return (
    <>
      <main>
        {homeSections.map(({ key, Component, props }) => (
          <Component key={key} {...(props ?? {})} />
        ))}
      </main>
    </>
  );
}
