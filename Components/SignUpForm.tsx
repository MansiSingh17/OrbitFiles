"use client";

import {useForm} from "react-hook-form";
import{useSignUp} from "@clerk/nextjs";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {Card, CardBody} from "@heroui/react";



//zod custome schema
import {signUpSchema} from "@/schemas/signUpSchema";

import { resolve } from "path"
import { fi } from "zod/v4/locales";
import { set } from "zod/v4-mini";

export default function SignUpForm(){
    const router = useRouter();
    const [verifying, setVerifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [authError, setAuthError] = useState<string | null>(null); 
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const{signUp, isLoaded, setActive} = useSignUp();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<z.infer<typeof signUpSchema>>({ 
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email:"",
            password:"",
            passwordConfirmation:"",
        },

    });
    const onSubmit = async(data:z.infer<typeof signUpSchema>) => {
        if(!isLoaded) return;
        setIsSubmitting(true);
        setAuthError(null);
        try{
            await signUp.create({
                emailAddress: data.email,
                password: data.password,
            })
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });
            setVerifying(true);
        }catch (error: any){
            console.error("Sign up error", error);
            setAuthError(error.errors ?.[0]?.message || "Something went wrong during sign up");

        } finally {
            setIsSubmitting(false);
        }   
    };
    const handleVerificationSubmit = async(
        e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!isLoaded || !signUp) return
        setIsSubmitting(true);
        setAuthError(null);
        try{
            const result = await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            });
            //todo : console this result
            if (result.status === "complete"){
                await setActive({session: result.createdSessionId});
                router.push("/dashboard");
            }
            else {
                console.error("Verification not complete", result);
                setVerificationError(
                    "Verification not complete. Please try again."
                );
                    }
        } catch(error:any)
                 { console.error("Verification error", error);
                    setVerificationError(
                        error.errors ?.[0]?.message || "Something went wrong during verification."
                    );
                 } finally{
                    setIsSubmitting(false);
                 }
        {

        }
    };
        if (verifying) {
            return (
                <Card className="w-full max-w-md border border-default-200 bg-default-50 shadow-xl">
                    <cardHeader className="flex flex-col gap-1 items-center pb-2">
                        <h1 className = "text-2xl font-bold text-default-900">
                            Verify your Email</h1>
                            <p className = "text-default-500-text-center">
                                We have sent a one-time verification code to your email address. 
                            </p>
                    </cardHeader>
                    <Divider/>
                    <cardBody className="py-6">
                        {VerificationError && (
                            <div className = "bg-danger-50 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 flex-shrink-0"/>
                                <p>{verificationError} </p>
                            </div>)}
                        <form onSubmit={handleVerificationSubmit}
                        className = "space-y-6">
                            <div className = "space-y-2">
                                <label htmlFor="verificationCode"
                                className = "text-sm font-medium text-default-900">
                                    Verification Code
                                </label>
                                <input
                                type="text"
                                id="verificationCode"
                                placeholder="Enter the 6-digit verification code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className = "w-full"
                                autoFocus
                                />
                            </div>
                            <Button
                            type="submit"
                            color="primary"
                            isLoading={isSubmitting}
                            className="w-full"
                            >
                                {isSubmitting ? "Verifying..." : "Verify Email"}
                            </Button>
                        </form>
                        <div className="mt-6 text-center">
                            <p className="text-sm text-default-500">
                                Didn't receive the code?{" "}
                                <button
                                    onClick={async () => {
                                        if (signUp) {
                                            await signUp.prepareEmailAddressVerification({
                                                strategy: "email_code",
                                            });
                                        }
                                    }}
                                className="text-primary-600 hover:underline font-medium">
                                    Resend Code
                                </button>
                            </p>
                        </div>
                    </cardBody>
                </Card>
            );
        }
        return (
            <card className="w-full max-w-md border border-default-200 bg-default-50 shadow-xl">
                <cardHeader className="flex flex-col gap-1 items-center pb-2">
                    <h1 className = "text-2xl font-bold text-default-900">
                        Create Your Account</h1>
                        <p className = "text-default-500-text-center">
                signup to start managing your images securely</p>
                </cardHeader>
                <Divider/>
                <cardBody className="py-6">
                    {authError && (
                        <div className = "bg-danger-50 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 flex-shrink-0"/>
                            <p>{authError} </p>
                        </div>)}
                <form onSubmit={handleSubmit(onSubmit)}
                className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email"
                        className="text-sm font-medium text-default-900">
                            Email 
                        </label>
                        <input
                        type="email"
                        id="email"
                        placeholder="your.email@example.com"
                        startContent=<Mail className="h-4 w-4 text-default-500"/>}
                        isInvalid={!!errors.email}
                        {...register("email")}
                        className="w-full"
                        />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password"
                            className="text-sm font-medium text-default-900">
                                Password
                            </label>
                            <input
                            type={showPassword?"text":"password"}
                            id="password"
                            placeholder="........."
                            startContent=<Lock className="h-4 w-4 text-default-500"/>}
                            endContent={
                                <button
                                isIconOnly
                                variant="light"
                                size="sm"
                                onClick={() => setShowPassword(!showPassword)}
                                type="button"
                                >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-default-500"/>
                                ) : (
                                    <Eye className="h-4 w-4 text-default-500"/>
                                )}
                                </button>
                            }
                            isInvalid={!!errors.password}
                            errorMessage={errors.password?.message}
                            {...register("password")}
                            className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="passwordConfirmation"
                            className="text-sm font-medium text-default-900">
                                Confirm Password
                            </label>
                            <input
                            type={showPassword?"text":"password"}
                            id="passwordConfirmation"
                            placeholder="........."
                            startContent=<Lock className="h-4 w-4 text-default-500"/>}
                            endContent={
                                <button
                                isIconOnly
                                variant="light"
                                size="sm"
                                onClick={() => setShowPassword(!showConfirmPassword)}
                                type="button"
                                >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 text-default-500"/>
                                ) : (
                                    <Eye className="h-4 w-4 text-default-500"/>
                                )}
                                </button>
                            }
                            isInvalid={!!errors.passwordConfirmation}
                            errorMessage={errors.passwordConfirmation?.message}
                            {...register("passwordConfirmation")}
                            className="w-full"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-2">
                                <checkCircle className="h-5 w-5 text-primary mt-0.5"/>
                                <p className="text-sm text-default-600">
                                    By signing up, you agree to our Terms of Service and Privacy Policy
                                    </p>
                            </div>
                        </div>
                        <Button
                        type="submit"
                        color="primary"
                        isLoading={isSubmitting}
                        className="w-full"
                        >
                            {isSubmitting ? "Creating account..." : "Create Account"}
                        </Button>
                    </form>
                </cardBody>
                <Divider/>
                <cardFooter className="flex justify-center py-4">
                    <p className="text-sm text-default-600">
                        Already have an account?{" "}
                        <Link href="/sign-in" 
                        className="text-primary hover:underline font-medium">
                            Sign In
                        </Link>
                    </p>
                </cardFooter>
            </card>
        );
    }