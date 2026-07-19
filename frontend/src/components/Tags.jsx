const STATUSES = ["ongoing","completed","student","available","booked","norway","international"];

export default function Tag({ children, status, variant = "default" }) {
  const isStatus = status && STATUSES.includes(status.toLowerCase());
  const cls = [
    "tag",
    variant !== "default" && `tag--${variant}`,
    isStatus && `tag--${status.toLowerCase()}`,
  ].filter(Boolean).join(" ");
  return <span className={cls}>{children}</span>;
}
