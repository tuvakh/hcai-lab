// webpage/src/components/Tag.jsx
const STATUSES = ["ongoing","completed","student","available","booked","norway","international"];

export default function Tag({ children, status, variant = "default" }) {
  const isStatus = status && STATUSES.includes(status.toLowerCase());
  const cls = [
    "tag",
    variant !== "default" && `tag--${variant}`,    // topic, interest, region
    isStatus && `tag--${status.toLowerCase()}`,    // ongoing, available, ...
  ].filter(Boolean).join(" ");
  return <span className={cls}>{children}</span>;
}
