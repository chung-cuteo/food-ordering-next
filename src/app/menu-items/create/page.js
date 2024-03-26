"use client";

import MenuItemForm from "@/components/MenuItemForm";
import UserTabs from "@/components/UserTabs";
import { useFetchProfile } from "@/hook/UseFetchProfile";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewMenuItemPage() {
  const router = useRouter();
  const { loading, data } = useFetchProfile();

  const handleFormSubmit = async (ev, data) => {
    ev.preventDefault();

    const savingPromise = fetch("/api/menu-items", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          router.push("/menu-items");
          return Promise.resolve();
        }
        return Promise.reject();
      })
      .catch((error) => {
        throw Error(error);
      });

    await toast.promise(savingPromise, {
      loading: "Saving this tasty item",
      success: "Saved",
      error: "Error",
    });
  };

  if (loading) {
    return "Loading user info...";
  }

  if (!data.admin) {
    return "Not an admin.";
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={true} />
      <div className="max-w-2xl mx-auto mt-8">
        <Link href={"/menu-items"} className="button">
          <span className="material-symbols-outlined">expand_circle_right</span>
          <span>Show all menu items</span>
        </Link>
      </div>
      <MenuItemForm menuItem={null} onSubmit={handleFormSubmit} />
    </section>
  );
}
