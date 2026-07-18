import Link from "next/link";

interface SectionHeadingProps {
  description?: string;
  href?: string;
  linkLabel?: string;
  title: string;
}

export function SectionHeading({
  description,
  href,
  linkLabel = "查看全部",
  title,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {href ? <Link href={href}>{linkLabel}</Link> : null}
    </div>
  );
}
