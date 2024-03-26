"use client";

import UserTabs from "@/components/UserTabs";
import { useFetchProfile } from "@/hook/UseFetchProfile";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loadingFetchMenuItems, setLoadingFetchMenuItems] = useState(false);
  const { loading, data } = useFetchProfile();

  const fetchMenuItems = () => {
    setLoadingFetchMenuItems(true);
    fetch("/api/menu-items")
      .then(async (res) => {
        if (res.ok) {
          const menuItems = await res.json();
          if (menuItems) setMenuItems(menuItems);
        }
      })
      .catch((error) => {
        throw Error(error);
      })
      .finally(() => {
        setLoadingFetchMenuItems(false);
      });
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  if (loading) {
    return "Loading user info...";
  }

  if (!data.admin) {
    return "Not an admin.";
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        <Link className="button flex" href={"/menu-items/create"}>
          <span>Crete new menu item</span>
          <span className="material-symbols-outlined">add</span>
        </Link>
      </div>
      <div>
        <h2 className="text-sm text-gray-500 mt-8">Edit menu item:</h2>
        {loadingFetchMenuItems && "Loading..."}
        <div className="grid grid-cols-3 gap-2">
          {menuItems?.length > 0 &&
            menuItems.map((item) => (
              <Link
                key={item._id}
                href={"/menu-items/edit/" + item._id}
                className="bg-gray-200 rounded-lg p-4"
              >
                <div className="relative">
                  <Image
                    className="rounded-md"
                    src={item.image}
                    alt={""}
                    width={200}
                    height={200}
                  />
                </div>
                <div className="text-center">{item.name}</div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
