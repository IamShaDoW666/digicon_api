"use server";
import { LoginFormValues } from "@/components/login-form";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/schema/loginSchema";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { encrypt } from "@/lib/auth";

export async function loginAction(formData: LoginFormValues) {
  const { email, password } = formData;
  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, errors };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      success: false,
      errors: {
        email: ["Invalid email"],
      },
    };
  }
  if (!user.password) {
    return {
      success: false,
      errors: {
        password: ["Password is not set"],
      },
    };
  }
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return {
      success: false,
      errors: {
        password: ["Invalid Credentials"],
      },
    };
  }

  const token = await encrypt({
    id: user.id,
    name: user.name ?? "User",
    email: user.email,
    time: new Date(),
    role: user.role,
    profile: user!.profile!,
    phone: user.phone!,
  });
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/login");
}
