import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { UserPlus, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import GoogleAuth from "@/components/shared/GoogleAuth"

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be atleast 2 characters" }),
  email: z.string().min({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters." }),
})

const SignUpForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values) {
    try {
      setLoading(true)
      setErrorMessage(null)

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (data.success === false) {
        setLoading(false)
        toast({ title: "Sign up failed! Please try again." })

        return setErrorMessage(data.message)
      }

      setLoading(false)

      if (res.ok) {
        toast({ title: "Sign up Successful!" })
        navigate("/sign-in")
      }
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
      toast({ title: "Something went wrong!" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 pt-20">
      <div className="flex p-6 max-w-6xl mx-auto flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        {/* Left - Brand Section */}
        <div className="flex-1 max-w-md lg:max-w-lg text-center lg:text-left">
          <Link
            to={"/"}
            className="inline-block mb-8 lg:mb-12"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="font-bold text-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-sky-600 bg-clip-text text-transparent">
                ClimateKhabar
              </span>
            </div>
          </Link>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                Join the Movement at{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
                  ClimateKhabar
                </span>
              </h1>
              <p className="text-xl text-slate-600 mt-4 leading-relaxed">
                Be part of a global community dedicated to environmental awareness and action.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "🌍 Create your personalized profile",
                "✍️ Publish and share your stories",
                "🌱 Connect with climate activists"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm lg:text-base">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Form Section */}
        <div className="flex-1 max-w-md w-full">
          <Card className="rounded-3xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
                  Create Account
                </h2>
                <p className="text-slate-500 mt-2">
                  Enter your details to register
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">Username</FormLabel>
                        <FormControl>
                          <Input 
                            type="text" 
                            placeholder="Choose a username" 
                            className="h-11 rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            className="h-11 rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Create a password"
                            className="h-11 rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Sign Up
                      </div>
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-slate-500">Or register with</span>
                    </div>
                  </div>

                  <GoogleAuth />
                </form>
              </Form>

              <div className="text-center mt-6 pt-6 border-t border-slate-200">
                <p className="text-slate-600">
                  Already have an account?{" "}
                  <Link 
                    to="/sign-in" 
                    className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>

              {errorMessage && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm text-center">{errorMessage}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SignUpForm
