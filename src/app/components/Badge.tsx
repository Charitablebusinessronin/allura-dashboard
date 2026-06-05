export function Badge({
  children,
  variant = "blue",
}: {
  children: React.ReactNode;
  variant?: "blue" | "teal" | "coral" | "purple" | "gray" | "green" | "yellow";
}) {
  const variants = {
    blue: "bg-[#E8F0FE] text-[#0C56EB]",
    teal: "bg-[#E0F5EE] text-[#0C9154]",
    coral: "bg-[#FFF1EC] text-[#FB5D0F]",
    purple: "bg-[#E9D5FF] text-[#7C3AED]",
    gray: "bg-[#F3F4F6] text-[#5A6071]",
    green: "bg-[#E0F5EE] text-[#0C9154]",
    yellow: "bg-[#FEF3C7] text-[#D97706]",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
