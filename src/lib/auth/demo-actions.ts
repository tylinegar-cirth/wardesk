"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const DEMO_CODE = process.env.DEMO_CODE || "WARDESK";

export async function enterDemo(formData: FormData) {
  const code = formData.get("code") as string;

  if (!code || code.toUpperCase() !== DEMO_CODE.toUpperCase()) {
    return { error: "Invalid demo code" };
  }

  cookies().set("wd-demo", "1", {
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: "lax",
  });

  redirect("/portal/advisors");
}

export async function enterStudioDemo(formData: FormData) {
  const code = formData.get("code") as string;

  if (!code || code.toUpperCase() !== DEMO_CODE.toUpperCase()) {
    return { error: "Invalid demo code" };
  }

  cookies().set("wd-demo", "1", {
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: "lax",
  });

  redirect("/studio-portal");
}

export async function exitDemo() {
  cookies().delete("wd-demo");
  redirect("/auth/login");
}

export async function exitStudioDemo() {
  cookies().delete("wd-demo");
  redirect("/studio/login");
}
