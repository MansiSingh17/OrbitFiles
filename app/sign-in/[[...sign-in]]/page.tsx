import { SignIn } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <main className="flex-1 flex justify-center items-center p-6">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl"
            }
          }}
          routing="path"
          path="/sign-in"
        />
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} OrbitFiles. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}