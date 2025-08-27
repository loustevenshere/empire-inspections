type Props = {
  children: React.ReactNode;
  className?: string;
};

export function Section({ children, className }: Props) {
  return (
    <section className={`mx-auto max-w-6xl px-4 ${className ?? ""}`}>{children}</section>
  );
}

