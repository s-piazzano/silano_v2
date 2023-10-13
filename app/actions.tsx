"use server";

import { cookies } from "next/headers";

export async function setCookiePolicy(data) {
  cookies().set({
    name: "cookiePolicy",
    value: "true",
    sameSite: "strict",
    secure: true,
  });
}
