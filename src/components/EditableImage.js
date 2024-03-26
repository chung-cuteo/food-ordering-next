import Image from "next/image";
import toast from "react-hot-toast";

export default function EditableImage({ link, setLink }) {
  const handleFileChange = async (ev) => {
    const files = ev.target.files;

    if (files?.length === 1) {
      const data = new FormData();
      data.set("file", files[0]);

      const uploadPromise = fetch("/api/upload", {
        method: "POST",
        body: data,
      })
        .then(async (res) => {
          if (res.ok) {
            const link = await res.json();
            if (link) setLink(link);
            return Promise.resolve();
          }
          return Promise.reject();
        })
        .catch((error) => {
          throw new Error(error);
        });

      await toast.promise(uploadPromise, {
        loading: "Uploading...",
        success: "Upload complete",
        error: "Upload error",
      });
    }
  };

  return (
    <div className="relative">
      {link && (
        <Image
          className="rounded-lg w-full h-full mb-1"
          src={link}
          width={250}
          height={250}
          alt={"avatar"}
        />
      )}
      {!link && (
        <div className="text-center bg-gray-200 p-4 text-gray-500 rounded-lg mb-1">
          No image
        </div>
      )}
      <label className="absolute bottom-0 right-0">
        <input type="file" className="hidden" onChange={handleFileChange} />
        <span className="flex items-center justify-center bg-gray-300 w-10 h-10 rounded-full cursor-pointer text-black">
          <span className="material-symbols-outlined">edit</span>
        </span>
      </label>
    </div>
  );
}
