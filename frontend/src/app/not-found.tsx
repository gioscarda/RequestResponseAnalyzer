import Link from "next/link"
export default function NotFound() {
  return (
    <div>
      <p>The page you are looking for doee not exist.</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
