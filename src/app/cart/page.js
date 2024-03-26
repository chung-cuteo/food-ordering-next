"use client";
import { CartContext, cartProductPrice } from "@/context/AppContext";
import AddressInputs from "@/components/AddressInputs";
import SectionHeaders from "@/components/SectionHeaders";
import CartProduct from "@/components/CartProduct";
import { useFetchProfile } from "@/hook/UseFetchProfile";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const DELIVERY_NUMBER = 5

export default function CartPage() {
  const { cartProducts, removeCartProduct } = useContext(CartContext);

  const [address, setAddress] = useState({});
  const { data: profileData } = useFetchProfile();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.href.includes("canceled=1")) {
        toast.error("Payment failed 😔");
      }
    }
  }, []);

  useEffect(() => {
    if (profileData?.city) {
      const { phone, streetAddress, city, postalCode, country } = profileData;
      const addressFromProfile = {
        phone,
        streetAddress,
        city,
        postalCode,
        country,
      };
      setAddress(addressFromProfile);
    }
  }, [profileData]);

  let subtotal = 0;
  for (const product of cartProducts) {
    subtotal += cartProductPrice(product);
  }

  const handleAddressChange = (propName, value) => {
    setAddress((prevAddress) => ({ ...prevAddress, [propName]: value }));
  };

  const proceedToCheckout = async (ev) => {
    ev.preventDefault();
    const promise = fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        cartProducts,
      }),
    })
      .then(async (res) => {
        if (res.ok) {
          const link = await res.json();
          window.location = link
          return Promise.resolve();
        }
        return Promise.reject();
      })
      .catch((error) => {
        throw Error(error);
      });

    await toast.promise(promise, {
      loading: "Preparing your order...",
      success: "Redirecting to payment...",
      error: "Something went wrong... Please try again later",
    });
  };

  if (cartProducts?.length === 0) {
    return (
      <section className="mt-8 text-center">
        <SectionHeaders mainHeader="Cart" />
        <p className="mt-4">Your shopping cart is empty 😔</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Cart" />
      </div>
      <div className="mt-8 grid gap-8 grid-cols-2">
        <div>
          {cartProducts?.length === 0 && (
            <div>No products in your shopping cart</div>
          )}
          {cartProducts?.length > 0 &&
            cartProducts.map((product, index) => (
              <CartProduct
                key={index}
                index={index}
                product={product}
                onRemove={removeCartProduct}
              />
            ))}
          <div className="py-2 pr-16 flex justify-end items-center">
            <div className="text-gray-500">
              Subtotal:
              <br />
              Delivery:
              <br />
              Total:
            </div>
            <div className="font-semibold pl-2 text-right">
              ${subtotal}
              <br />
              ${DELIVERY_NUMBER}
              <br />${subtotal + DELIVERY_NUMBER}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2>Checkout</h2>
          <form onSubmit={proceedToCheckout}>
            <AddressInputs
              addressProps={address}
              setAddressProp={handleAddressChange}
            />
            <button type="submit">Pay ${subtotal + DELIVERY_NUMBER}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
