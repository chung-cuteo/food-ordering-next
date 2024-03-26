"use client";
import UserForm from "@/components/UserForm";
import UserTabs from "@/components/UserTabs";
import { useFetchProfile } from "@/hook/UseFetchProfile";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditUserPage() {
  const { loading, data: currentUser } = useFetchProfile();
  const [user, setUser] = useState(null);
  const { id } = useParams();

  const fetchUser = () => {
    fetch("/api/profile?_id=" + id)
      .then(async (res) => {
        if (res.ok) {
          const user = await res.json();
          setUser(user);
        }
      })
      .catch((error) => {
        throw Error(error);
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSaveButtonClick = async (ev, data) => {
    ev.preventDefault();

    const promise = fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, _id: id }),
    })
      .then(async (res) => {
        if (res.ok) return Promise.resolve();
        return Promise.reject();
      })
      .catch((error) => {
        throw Error(error);
      });

    await toast.promise(promise, {
      loading: "Saving user...",
      success: "User saved",
      error: "An error has occurred while saving the user",
    });
  };

  if (loading) {
    return "Loading user profile...";
  }

  if (!currentUser.admin) {
    return "Not an admin";
  }

  return (
    <section className="mt-8 mx-auto max-w-2xl">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        <UserForm user={user} currentUser={currentUser} onSave={handleSaveButtonClick} />
      </div>
    </section>
  );
}
