import Image from "next/image";

export default function LoginPage() {
  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">Login</h1>
      <form className="max-w-xs mx-auto">
        <input
          type="email"
          name="email"
          placeholder="email"
          value=''
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value=''
        />
        <button type="submit">
          Login
        </button>
        <div className="my-4 text-center text-gray-500">
          or login with provider
        </div>
        <button
          type="button"
          className="flex gap-4 justify-center"
        >
          <Image src={"/google.png"} alt={""} width={24} height={24} />
          Login with google
        </button>
      </form>
    </section>
  );
}
