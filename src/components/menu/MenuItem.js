import Image from "next/image";

export default function MenuItem() {
  return (
    <>
      <div className="flex flex-col items-center bg-gray-200 p-4 rounded-lg text-center hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all">
        <div className="">
          <img src="/pizza.png" className="max-h-24 mx-auto" alt="{}" />
        </div>
        <h2 className="font-semibold my-2 text-xl">Pizza name</h2>
        <p className="text-gray-500 text-sm">
          piza description piza description piza description{" "}
        </p>
        <button className="flex items-center border-0 py-2 mt-4  bg-primary text-white font-semibold w-auto">
          add to card
        </button>
      </div>
    </>
  );
}
