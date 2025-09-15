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
