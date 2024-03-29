import Link from "next/link"
export default function NotFound() {
  return (
    <div className="w-[calc(80dvw)] text-center m-10">
      <p className="text-semibold text-amber-700 break-words">The page you are looking for does not exist!</p>
      <p className="mt-10">
          <span>Return  </span>
          <Link href="/" className="text-bold border-2 border-amber-700 rounded-md p-2 bg-amber-200">
              Home
          </Link>
      </p>
    </div>
  );
}
