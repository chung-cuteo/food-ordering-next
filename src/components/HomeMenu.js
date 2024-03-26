"use client";

import SectionHeaders from "@/components/SectionHeaders";
import MenuItem from "@/components/MenuItem";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function HomeMenu() {
  const [bestSellers, setBestSellers] = useState([]);
  const [loadingFetchBestSellers, setLoadingFetchBestSellers] = useState(false);

  const fetchBestSellers = () => {
    setLoadingFetchBestSellers(true);
    fetch("/api/menu-items")
      .then(async (res) => {
        if (res.ok) {
          const menuItems = await res.json();
          setBestSellers(menuItems.slice(-3));
        }
      })
      .catch((error) => {
        throw Error(error);
      })
      .finally(() => {
        setLoadingFetchBestSellers(false);
      });
  };

  useEffect(() => {
    fetchBestSellers();
  }, []);

  return (
    <section className="mt-12">
      <div className="absolute left-0 right-0 w-full justify-start">
        <div className="absolute left-0 -top-[70px] text-left -z-10">
          <Image src={"/sallad1.png"} width={109} height={189} alt={"sallad"} />
        </div>
        <div className="absolute -top-[100px] right-0 -z-10">
          <Image src={"/sallad2.png"} width={107} height={195} alt={"sallad"} />
        </div>
      </div>
      <div className="text-center mb-4">
        <SectionHeaders
          subHeader={"check out"}
          mainHeader={"Our Best Sellers"}
        />
      </div>

      {loadingFetchBestSellers && <p>Loading....</p>}

      <div className="grid sm:grid-cols-3 gap-4">
        {bestSellers?.length > 0 &&
          bestSellers.map((item) => <MenuItem key={item._id} {...item} />)}
      </div>
    </section>
  );
}
