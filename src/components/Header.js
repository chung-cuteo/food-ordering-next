"use client";

import { CartContext } from "@/context/AppContext";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext } from "react";
import { useFetchProfile } from "@/hook/UseFetchProfile";

function AuthLinks({ status, userName }) {
  if (status === "authenticated") {
    return (
      <>
        <Link href={"/profile"} className="whitespace-nowrap">
          Hello, {userName}
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-primary rounded-full text-white px-8 py-2"
        >
          Logout
        </button>
      </>
    );
  }
  if (status === "unauthenticated") {
    return (
      <>
        <Link href={"/login"}>Login</Link>
        <Link
          href={"/register"}
          className="bg-primary rounded-full text-white px-8 py-2"
        >
          Register
        </Link>
      </>
    );
  }
}

export default function Header() {
  const { status } = useSession();
  const { data: user } = useFetchProfile();

  const userName = user?.name || user?.email;
  const { cartProducts } = useContext(CartContext);

  return (
    <header>
      <nav>
        <ul className="flex items-center gap-8 w-full text-gray-500 font-semibold">
          <li>
            <Link className="text-primary font-semibold text-2xl" href={"/"}>
              PIZZA
            </Link>
          </li>
          <li className="ml-auto pl-4">
            <Link href={"/"} className="ml-auto">
              Home
            </Link>
          </li>
          <li>
            <Link href={"/menu"}>Menu</Link>
          </li>
          <li>
            <Link href={"/#about"}>About</Link>
          </li>
          <li>
            <Link href={"/#contact"}>Contact</Link>
          </li>
          <li className="flex items-center gap-4 px-2 py-1 rounded border border-gray-200">
            <AuthLinks status={status} userName={userName} />
          </li>
          <li>
            <Link href={"/cart"} className="relative flex items-center mr-4">
              <span className="material-symbols-outlined">
                shopping_cart_checkout
              </span>{" "}
              <span className="absolute -top-3 -right-3 flex items-center justify-center bg-primary text-white text-xs w-5 h-5 p-1 rounded-full leading-3">
                {cartProducts?.length}
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
