"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";

interface AddToCartButtonProps {
    slug: string;
    title: string;
    price: number;
}

export default function AddToCartButton({ slug, title, price }: AddToCartButtonProps) {
    const router = useRouter();
    const { addItem } = useCart();

    const handleAddToCart = async () => {
        try {
            await addItem({
                slug,
                title,
                basePrice: price,
                price,
                options: [],
            });

            router.push("/cart");
        } catch (err) {
            console.error("Add to cart failed:", err);
            alert("Something went wrong while adding to cart.");
        }
    };

    return (
        <button onClick={handleAddToCart} className="btn btn-primary">
            Book This Service
        </button>
    );
}
