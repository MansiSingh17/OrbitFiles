import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "OrbitFiles",
  description: "Secure cloud storage for your files, powered by ImageKit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorBackground: "#ffffff",
          colorInputBackground: "#ffffff",
          colorInputText: "#1e293b",
          colorText: "#1e293b",
          colorPrimary: "#3B82F6",
          colorDanger: "#ef4444",
          colorSuccess: "#10b981",
          colorWarning: "#f59e0b",
          colorTextOnPrimaryBackground: "#ffffff",
          colorTextSecondary: "#64748b",
          colorNeutral: "#f1f5f9",
          borderRadius: "0.75rem",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
        },
        elements: {
          rootBox: "bg-white",
          card: "bg-white shadow-2xl border-2 border-gray-200 rounded-2xl",
          modalContent: "bg-white",
          modalCloseButton: "text-gray-600 hover:text-gray-900",
          headerTitle: "text-gray-900 font-bold text-2xl",
          headerSubtitle: "text-gray-600",
          
          // Social buttons styling
          socialButtonsBlockButton: "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-blue-400 font-medium shadow-md hover:shadow-lg transition-all rounded-xl py-3",
          socialButtonsBlockButtonText: "text-gray-700 font-semibold text-base",
          socialButtonsBlockButtonArrow: "text-gray-600",
          
          dividerLine: "bg-gray-300",
          dividerText: "text-gray-600 font-medium",
          
          // Primary button (Continue button)
          formButtonPrimary: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all py-3 text-base",
          
          // Form field styling
          formFieldLabel: "text-gray-900 font-bold text-sm mb-2",
          formFieldInput: "bg-white text-gray-900 border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl py-3 px-4 text-base placeholder:text-gray-400",
          formFieldInputShowPasswordButton: "text-gray-600 hover:text-gray-900",
          
          footerActionLink: "text-blue-600 font-semibold hover:text-blue-700 hover:underline",
          identityPreviewText: "text-gray-900",
          identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
          formHeaderTitle: "text-gray-900 font-bold text-xl",
          formHeaderSubtitle: "text-gray-600",
          otpCodeFieldInput: "bg-white text-gray-900 border-2 border-gray-300 focus:border-blue-500 rounded-xl",
          formResendCodeLink: "text-blue-600 font-semibold hover:text-blue-700",
          footer: "bg-white",
          footerActionText: "text-gray-600",
          modalBackdrop: "bg-gray-900/50 backdrop-blur-sm",
          alertText: "text-gray-900",
          formFieldAction: "text-blue-600 hover:text-blue-700 font-semibold",
          identityPreview: "bg-gray-50 border-2 border-gray-200 rounded-lg",
          formFieldSuccessText: "text-green-600 font-medium",
          formFieldErrorText: "text-red-600 font-medium",
          formFieldWarningText: "text-yellow-600 font-medium",
          spinner: "text-blue-600",
          badge: "bg-blue-100 text-blue-700 font-semibold",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} antialiased`}
          suppressHydrationWarning
        >
          <Providers>{children}</Providers>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}