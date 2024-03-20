"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createStatus, setCreateStatus] = useState("");
  const [userCreated, setUserCreated] = useState(false);

  const handelSubmit = async (event) => {
    event.preventDefault();
    setCreateStatus("loading");

    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const responseJson = await response.json();

    setEmail("");
    setPassword("");

    if (responseJson.status === 400) {
      if (responseJson.message === "error") {
        setCreateStatus("error");
      }
      setUserCreated(true);
    }

    setCreateStatus("sucessed");
  };

  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">Register</h1>

      {userCreated && (
        <div className="my-4 text-center">
          User created.
          <br />
          Now you can{" "}
          <Link className="underline" href={"/login"}>
            Login &raquo;
          </Link>
        </div>
      )}

      {createStatus === "error" && (
        <div className="my-4 text-center">
          An error has occurred.
          <br />
          Please try again later
        </div>
      )}

      <form className="block max-w-xs mx-auto" onSubmit={handelSubmit}>
        <input
          type="email"
          placeholder="email"
          disabled={createStatus === "loading"}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          disabled={createStatus === "loading"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Register</button>
        <div className="my-4 text-center text-gray-500">
          or login with provider
        </div>
        <button
          disabled={createStatus === "loading"}
          className="flex gap-4 justify-center"
        >
          <Image src={"/google.png"} alt={""} width={24} height={24} />
          Login with google
        </button>
        <div className="text-center my-4 text-gray-500 border-t pt-4">
          Existing account?{" "}
          <Link className="underline" href={"/login"}>
            Login here &raquo;
          </Link>
        </div>
      </form>
    </section>
  );
}
