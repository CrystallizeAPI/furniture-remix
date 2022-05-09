import { Link } from "@remix-run/react";
import ProductPage from "~/routes/shop/$folder.$product";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { ClientOnly } from "../hooks/useHydrated";
import { useLocalBasket } from "../hooks/useLocalBasket";

const styles: React.CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
  border: "2px solid red",
  padding: "5px",
};

export const Basket: React.FC = () => {
  const { basket } = useLocalBasket();
  const { isAuthenticated, userInfos } = useAuth();
  return (
    <div style={styles}>
      <ClientOnly>
        {(() => {
          if (isAuthenticated) {
            return (
              <>
                <p>
                  Hello {userInfos.firstname} {userInfos.lastname}
                </p>
                <p>
                  <Link to="/orders">My Orders</Link>
                </p>
              </>
            );
          }
          return <></>;
        })()}
      </ClientOnly>
      <h5>Basket</h5>
      <ClientOnly fallback={<p>Your basket is empty.</p>}>
        <InnerBasket basket={basket} />
      </ClientOnly>
      <p>
        <Link to={"/cart"}>See the cart</Link>
        <br />
        <Link to={"/checkout"}>Place the order</Link>
      </p>
    </div>
  );
};

const InnerBasket: React.FC<{ basket: any }> = ({ basket }) => {
  return (
    <ul>
      {basket &&
        Object.keys(basket.items).map((key: string) => {
          const item: any = basket.items[key as keyof typeof basket.items];
          return (
            <li key={key + item.quantity}>
              {item.name} - x{item.quantity}
            </li>
          );
        })}
    </ul>
  );
};

export const HydratedBasket: React.FC = () => {
  const { cart, loading } = useCart();
  const { addToBasket, removeFromBasket } = useLocalBasket();

  return (
    <div className="bg-grey mt-10 rounded p-10  mx-auto">
      {loading && <p>Loading...</p>}
      <h1 className="font-bold text-4xl mt-5 mb-10">Your cart</h1>
      <div className="flex flex-col">
        {cart &&
          cart.cart.items.map((item: any) => (
            <div key={item.id} className="flex justify-between">
              <div className="flex flex-col">
                <p className="text-xl">
                  {item.product.name} × {item.quantity}
                </p>
              </div>
              <p>${item.price.gross * item.quantity}</p>
            </div>
          ))}
        {cart && (
          <div className="flex justify-between items-center border-t-2 border-text pt-4">
            <p className="font-semibold text-xl">Total</p>
            <p>${cart.total.gross}</p>
          </div>
        )}
        <Link
          to="/checkout"
          className="py-3 mt-10 rounded font-semibold bg-buttonBg text-buttonText w-auto text-center"
        >
          Go to Checkout
        </Link>
      </div>
    </div>
  );
};
