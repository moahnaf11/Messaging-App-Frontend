import { Link } from "react-router-dom";
function ErrorPage() {
  return (
    <main className="h-screen p-3 flex flex-col items-center gap-2 justify-center bg-gray-800 text-white">
      <h1 className="text-lg font-custom font-bold">
        Sorry... Page not found!
      </h1>
      <div>
        Navigate back{" "}
        <Link className="hover:text-blue-400 font-bold" to="/">
          Home
        </Link>
      </div>
    </main>
  );
}

export default ErrorPage;
