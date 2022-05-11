import { useLocalCart } from "~/core/hooks/useLocalCart";
import { sendPaidOrder } from "~/core/UseCases";
import { useNavigate } from "@remix-run/react";
import { useState } from "react";

export const CrystalCoin: React.FC = () => {
    const { cart, isEmpty, empty } = useLocalCart();
    const [paying, setPaying] = useState(false);
    const navigate = useNavigate();

    if (isEmpty()) {
        return null;
    }

    return <button disabled={paying} onClick={async () => {
        setPaying(true);
        await sendPaidOrder(cart);
        empty();
        navigate(`/order/cart/${cart.cartId}`, { replace: true });
    }}>Place with Crystal Coins (fake)</button>

}
