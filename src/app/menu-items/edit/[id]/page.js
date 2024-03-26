"use client";
import DeleteButton from "@/components/DeleteButton";
import MenuItemForm from "@/components/MenuItemForm";
import UserTabs from "@/components/UserTabs";
import { useFetchProfile } from "@/hook/UseFetchProfile";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditMenuItemPage() {
  const router = useRouter();
  const { id } = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const { loading, data } = useFetchProfile();

  useEffect(() => {
    fetch("/api/menu-items").then( async (res) => {
      if(res.ok) {
        const items = await res.json()
        const item = items.find((i) => i._id === id);
        setMenuItem(item);
      }
    }).catch((error)=>{
      throw Error(error)
    });
  }, []);

  const handleFormSubmit = async (ev, data) => {
    ev.preventDefault();
    data = { ...data, _id: id };

    const savingPromise = fetch("/api/menu-items", {
      method: "PUT",
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

  const handleDeleteClick = async () => {
    const promise = fetch("/api/menu-items?_id=" + id, {
      method: "DELETE",
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

    await toast.promise(promise, {
      loading: "Deleting...",
      success: "Deleted",
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

      <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit} />
      <div className="max-w-md mx-auto mt-2">
        <div className="max-w-xs ml-auto pl-4">
          <DeleteButton
            label="Delete this menu item"
            onDelete={handleDeleteClick}
          />
        </div>
      </div>
    </section>
  );
}
