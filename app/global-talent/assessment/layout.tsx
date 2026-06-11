import { StoreProvider } from "@/components/providers/StoreProvider";

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StoreProvider>{children}</StoreProvider>;
}
