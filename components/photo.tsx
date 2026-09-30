type PhotoProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

export function Photo({ priority = false, alt, ...props }: PhotoProps) {
  return (
    // The landing stylesheet crops these images with object-fit.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
