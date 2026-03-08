import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/DashboardContent";
import { CloudUpload } from "lucide-react";
import Navbar from "@/components/Navbar";

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  // Serialize the user data to avoid passing the Clerk User object directly
  const serializedUser = user
    ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        username: user.username,
        emailAddress: user.emailAddresses?.[0]?.emailAddress,
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[10%] w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-3xl animate-glow"></div>
        <div className="absolute bottom-40 left-[15%] w-[350px] h-[350px] bg-blue-300/15 rounded-full blur-3xl animate-glow" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <Navbar user={serializedUser} />

      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <DashboardContent
          userId={userId}
          userName={
            user?.firstName ||
            user?.fullName ||
            user?.emailAddresses?.[0]?.emailAddress ||
            ""
          }
        />
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-blue-200 py-6 mt-auto">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <CloudUpload className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-bold text-gray-900">OrbitFiles</h2>
            </div>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} OrbitFiles. Secure cloud storage.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}