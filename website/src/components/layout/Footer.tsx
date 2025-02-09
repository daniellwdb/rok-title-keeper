interface FooterProps {
  marginTop?: number;
}

export default function Footer({ marginTop }: FooterProps) {
  return (
    <footer
      className={`b-top mt-${marginTop ?? 12} border border-gray-800 bg-black`}
    >
      <div className="mx-auto max-w-7xl overflow-hidden py-3">
        <p className="mb-3 mt-3 text-center text-base text-gray-100">
          &copy; 2023 Roka. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
