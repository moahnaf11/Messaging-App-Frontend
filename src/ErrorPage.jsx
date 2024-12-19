import { Link } from "react-router-dom";
function ErrorPage() {
  return (
    <main className="h-[calc(100vh-3.75rem)] p-3 flex flex-col items-center gap-2 justify-center bg-gray-800 text-white">
      <h1 className="font-custom font-bold">Sorry... Page not found!</h1>
      <div>
        Navigate back to
        <Link className="underline-offset-1 hover:text-blue-400" to="/">
          Home
        </Link>
      </div>
    </main>
  );
}

export default ErrorPage;
