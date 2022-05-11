import { Link } from "@remix-run/react";
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
    <div className="mt-10 rounded p-10  mx-auto">
      {loading && <p>Loading...</p>}
      <h1 className="font-bold text-4xl mt-5 mb-10">Cart</h1>
      <div className="flex flex-col gap-3">
        {cart &&
          cart.cart.items.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between bg-grey2 py-5 px-10 items-center"
            >
              <div className="flex flex-col">
                <p className="text-xl font-semibold">
                  {item.product.name} × {item.quantity}
                </p>
                <p>${item.price.gross * item.quantity}</p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    removeFromBasket(item.variant);
                  }}
                >
                  -
                </button>
                <p>{item.quantity}</p>
                <button onClick={() => addToBasket(item.variant)}>+</button>
              </div>
            </div>
          ))}
        {cart && (
          <div className="flex flex-col gap-4 border-b-2 border-grey4 py-4 items-end">
            <div className="flex text-grey3 justify-between w-60">
              <p>Net</p>
              <p>€ {cart.total.net}</p>
            </div>
            <div className="flex text-grey3 justify-between w-60">
              <p>Tax amount</p>
              <p>€ {cart.total.taxAmount}</p>
            </div>
            <div className="flex font-bold text-xl justify-between w-60">
              <p>To pay</p>
              <p>€ {cart.total.gross}</p>
            </div>
          </div>
        )}
        <div className="flex justify-between mt-10">
          <Link to="/" className="bg-grey py-2 px-5 text-center font-semibold">
            Back
          </Link>
          <Link
            to="/checkout"
            className="bg-buttonBg2 py-2 px-4 w-40 text-center font-bold"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};
