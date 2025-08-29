import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    window.localStorage.removeItem("isAdminLoggedIn"); // Clear the flag
    router.push("/"); // Redirect to the login page
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white  rounded-lg font-semibold hover:bg-red-700 transition-colors"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
