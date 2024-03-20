"use client";
// import {CartContext} from "@/components/AppContext";
import IconBars2 from "@/components/icons/IconBars2";
import IconShoppingCart from "@/components/icons/IconShoppingCart";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useState } from "react";

export default function Header() {
  return (
    <header className="flex items-center w-full">
      <nav className="flex items-center w-full text-gray-500 font-semibold">
        <Link className="text-primary font-semibold text-2xl" href={"/"}>
          PIZZA
        </Link>
        <Link href={"/"}>Home</Link>
        <Link href={"/menu"}>Menu</Link>
        <Link href={"/#about"}>About</Link>
        <Link href={"/#contact"}>Contact</Link>

        <div className="flex items-center gap-4 ml-auto pl-4">
          <Link href={"/login"} className=" ">
            Login
          </Link>
          <Link
            href={"/register"}
            className="bg-primary rounded-full text-white px-8 py-2 "
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}
