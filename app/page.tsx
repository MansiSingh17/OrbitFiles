import { Button } from "@heroui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";
import {
  CloudUpload,
  Shield,
  Folder,
  FileText,
  Image as ImageIcon,
  ArrowRight,
  Sparkles,
  Zap,
  Lock,
  Video,
  Music,
  FileSpreadsheet,
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero section */}
        <section className="relative py-20 md:py-32 px-4 md:px-6 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl animate-glow"></div>
            <div className="absolute top-40 right-[15%] w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-3xl animate-glow" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 left-[20%] w-[350px] h-[350px] bg-blue-100/40 rounded-full blur-3xl animate-glow" style={{animationDelay: '2s'}}></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          </div>

          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 text-center lg:text-left">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700 font-medium">Secure Cloud Storage</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                    Store your{" "}
                    <span className="gradient-text">files</span>{" "}
                    with ease
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-gray-600">
                    Images, Documents, Videos & More ⚡
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                  <SignedOut>
                    <Link href="/sign-up">
                      <Button 
                        size="lg" 
                        variant="solid" 
                        color="primary"
                        className="font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all bg-gradient-to-r from-blue-600 to-blue-500"
                      >
                        Get Started Free
                      </Button>
                    </Link>
                    <Link href="/sign-in">
                      <Button 
                        size="lg" 
                        variant="bordered" 
                        color="primary"
                        className="font-semibold border-2 border-blue-500 hover:bg-blue-50 transition-all"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/dashboard">
                      <Button
                        size="lg"
                        variant="solid"
                        color="primary"
                        endContent={<ArrowRight className="h-5 w-5" />}
                        className="font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all bg-gradient-to-r from-blue-600 to-blue-500"
                      >
                        Go to Dashboard
                      </Button>
                    </Link>
                  </SignedIn>
                </div>
              </div>

              {/* Right side - Enhanced Multi-File Type Display */}
              <div className="flex justify-center order-first lg:order-last">
                <div className="relative w-80 h-80 md:w-96 md:h-96">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200/60 via-blue-300/40 to-blue-400/30 rounded-full blur-3xl animate-pulse-blue"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="relative p-8 rounded-3xl bg-white/90 backdrop-blur-xl border-2 border-blue-200 shadow-2xl shadow-blue-500/20 animate-float">
                        <div className="relative w-32 h-32 md:w-40 md:h-40">
                          <div className="absolute top-4 left-4 p-6 bg-red-100 rounded-2xl shadow-lg transform rotate-12">
                            <FileText className="h-16 w-16 text-red-500" strokeWidth={1.5} />
                          </div>
                          <div className="absolute top-2 left-2 p-6 bg-purple-100 rounded-2xl shadow-lg transform -rotate-6">
                            <ImageIcon className="h-16 w-16 text-purple-500" strokeWidth={1.5} />
                          </div>
                          <div className="absolute top-0 left-0 p-6 bg-blue-100 rounded-2xl shadow-xl border-2 border-blue-300">
                            <Folder className="h-16 w-16 text-blue-600" strokeWidth={1.5} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute -top-6 -right-6 p-3 rounded-xl bg-white border-2 border-yellow-200 shadow-lg animate-pulse">
                        <Zap className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div className="absolute -bottom-6 -left-6 p-3 rounded-xl bg-white border-2 border-green-200 shadow-lg">
                        <Lock className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="absolute top-12 -left-12 p-3 rounded-xl bg-white border-2 border-blue-200 shadow-lg">
                        <CloudUpload className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="absolute bottom-12 -right-12 p-3 rounded-xl bg-white border-2 border-orange-200 shadow-lg">
                        <Video className="h-6 w-6 text-orange-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute inset-8 border-2 border-blue-300/30 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
                  <div className="absolute inset-16 border-2 border-blue-200/20 rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-white via-blue-50/30 to-white">
          <div className="container mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-4">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">Features</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Everything you need
              </h2>
              <p className="text-lg text-gray-600">Powerful features made simple</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              <Card className="bg-white border-2 border-blue-100 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 hover:border-blue-300 transition-all duration-300 group overflow-hidden">
                <CardBody className="p-8 text-center relative bg-white">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-100/0 group-hover:from-blue-50 group-hover:to-blue-100/50 transition-all duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl group-hover:from-blue-200 group-hover:to-blue-100 transition-all shadow-md group-hover:shadow-lg">
                      <CloudUpload className="h-14 w-14 text-blue-600 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">
                      Quick Uploads
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Drag, drop, and done. Upload any file type in seconds with our intuitive interface.
                    </p>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-white border-2 border-blue-100 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 hover:border-blue-300 transition-all duration-300 group overflow-hidden">
                <CardBody className="p-8 text-center relative bg-white">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-100/0 group-hover:from-blue-50 group-hover:to-blue-100/50 transition-all duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl group-hover:from-blue-200 group-hover:to-blue-100 transition-all shadow-md group-hover:shadow-lg">
                      <Folder className="h-14 w-14 text-blue-600 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">
                      Smart Organization
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Keep everything tidy with folders. Find any file instantly with powerful search.
                    </p>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-white border-2 border-blue-100 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 hover:border-blue-300 transition-all duration-300 group sm:col-span-2 md:col-span-1 mx-auto sm:mx-0 max-w-md sm:max-w-full overflow-hidden">
                <CardBody className="p-8 text-center relative bg-white">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-100/0 group-hover:from-blue-50 group-hover:to-blue-100/50 transition-all duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl group-hover:from-blue-200 group-hover:to-blue-100 transition-all shadow-md group-hover:shadow-lg">
                      <Shield className="h-14 w-14 text-blue-600 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">
                      Locked Down
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Your files are encrypted and secure. Private storage, your eyes only.
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* File types supported */}
            <div className="mt-16 text-center">
              <p className="text-sm text-gray-500 mb-4">Supports all your files</p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Images</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Documents</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                  <Video className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Videos</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                  <Music className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Audio</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                  <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Spreadsheets</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto text-center">
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-12 max-w-3xl mx-auto shadow-xl shadow-blue-500/10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Ready to get started?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of users storing their files securely
              </p>
              <SignedOut>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      variant="solid"
                      color="primary"
                      endContent={<ArrowRight className="h-4 w-4" />}
                      className="font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all bg-gradient-to-r from-blue-600 to-blue-500"
                    >
                      Get Started Now
                    </Button>
                  </Link>
                </div>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="solid"
                    color="primary"
                    endContent={<ArrowRight className="h-4 w-4" />}
                    className="font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all bg-gradient-to-r from-blue-600 to-blue-500"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
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