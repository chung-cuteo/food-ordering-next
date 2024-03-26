"use client";
import UserForm from "@/components/UserForm";
import UserTabs from "@/components/UserTabs";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import { useFetchProfile } from "@/hook/UseFetchProfile";

export default function ProfilePage() {
  const { data: profileData, loading: profileFetchLoading } = useFetchProfile();

  async function handleProfileInfoUpdate(ev, data) {
    ev.preventDefault();

    const savingPromise = fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          return Promise.resolve();
        }
        return Promise.reject();
      })
      .catch((error) => {
        throw Error(error);
      });

    await toast.promise(savingPromise, {
      loading: "Saving...",
      success: "Profile saved!",
      error: "Error",
    });
  }

  if (profileFetchLoading) {
    return "Loading...";
  }

  if (!profileData) {
    return redirect("/login");
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={profileData?.admin} />
      <div className="max-w-2xl mx-auto mt-8">
        <UserForm user={profileData} currentUser={profileData} onSave={handleProfileInfoUpdate} />
      </div>
    </section>
  );
}
