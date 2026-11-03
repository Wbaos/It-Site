"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/lib/CartContext";

interface AddToCartButtonProps {
    slug: string;
    title: string;
    price: number;
}

export default function AddToCartButton({ slug, title, price }: AddToCartButtonProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isSpanish = pathname === "/es" || (pathname ?? "").startsWith("/es/");
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
            alert(isSpanish ? "Algo salió mal al agregar al carrito." : "Something went wrong while adding to cart.");
        }
    };

    return (
        <button onClick={handleAddToCart} className="btn btn-primary">
            {isSpanish ? "Reservar este servicio" : "Book This Service"}
        </button>
    );
}
