"use client";

import Link from "next/link"
export default function Error() {
  return (
    <div className="w-full text-center m-10">
      <p className="text-semibold text-red-800">Some error occurred! Please try again.</p>
      <p className="mt-10">
          <span>Return  </span>
          <Link href="/" className="text-bold border-2 border-amber-700 rounded-md p-2 bg-amber-200">
              Home
          </Link>
      </p>
    </div>
  );
}

