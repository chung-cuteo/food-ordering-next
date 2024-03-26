"use client";

import UserTabs from "@/components/UserTabs";
import DeleteButton from "@/components/DeleteButton";
import { useFetchProfile } from "@/hook/UseFetchProfile";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const { data: profileData, loading: profileFetchLoading } = useFetchProfile();
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editedCategory, setEditedCategory] = useState(null);

  const fetchCategories = () => {
    fetch("/api/categories", {
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        const categories = await res.json();
        if (Object.keys(categories).length > 0) {
          setCategories(categories);
        }
      })
      .catch((error) => {
        throw Error(error);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const data = { name: categoryName };

    if (editedCategory) {
      data._id = editedCategory._id;
    }

    if (!data) return;

    const updatedCaregories = (data) => {
      if (editedCategory) {
        data = categories.find((category) => category._id === data._id);
        data.name = categoryName;
        return;
      }
      setCategories((pre) => {
        return [data, ...pre];
      });
    };

    const categoryPromise = fetch("/api/categories", {
      method: editedCategory ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          updatedCaregories(data);
          setCategoryName("");
          setEditedCategory(null);
          return Promise.resolve();
        }
        return Promise.reject();
      })
      .catch((error) => {
        throw Error(error);
      });

    await toast.promise(categoryPromise, {
      loading: editedCategory
        ? "Updating category..."
        : "Creating your new category...",
      success: editedCategory ? "Category updated" : "Category created",
      error: "Error, sorry...",
    });
  };

  const handleDeleteClick = async (_id) => {
    if (!_id) return;

    const promise = fetch("/api/categories?_id=" + _id, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (res.ok) {
          const updatedCategories = categories.filter(
            (category) => category._id !== _id
          );
          console.log(updatedCategories);
          setCategories(updatedCategories);
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

  if (profileFetchLoading) return "Loading";

  if (!profileData.admin) return "is not admin";

  return (
    <section className="mt-8 nax-w-lg max-auto">
      <UserTabs isAdmin={true} />

      <form className="mt-8" onSubmit={handleCategorySubmit}>
        <div className="flex gap-2 items-end">
          <div className="grow">
            <label>
              {editedCategory ? "Update category" : "New category name"}
              {editedCategory && (
                <>
                  : <b>{editedCategory.name}</b>
                </>
              )}
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(ev) => setCategoryName(ev.target.value)}
            />
          </div>
          <div className="pb-2 flex gap-2">
            <button className="border border-primary" type="submit">
              {editedCategory ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setCategoryName("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>

      <div>
        <h2 className="mt-8 text-sm text-gray-500">Existing categories</h2>
        {categories?.length > 0 &&
          categories.map((category) => (
            <div
              key={category._id}
              className="bg-gray-100 rounded-xl p-2 px-4 flex gap-1 mb-1 items-center"
            >
              <div className="grow">{category.name}</div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditedCategory(category);
                    setCategoryName(category.name);
                  }}
                >
                  Edit
                </button>
                <DeleteButton
                  label="Delete"
                  onDelete={() => handleDeleteClick(category._id)}
                />
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
