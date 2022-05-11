import { Link } from "@remix-run/react";
import { useAuth } from "../hooks/useAuth";
import { useRemoteCart } from "../hooks/useRemoteCart";
import { ClientOnly } from "@crystallize/reactjs-hooks";
import { useLocalCart } from "../hooks/useLocalCart";

const styles: React.CSSProperties = {
  position: "absolute",
  bottom: 0,
  right: 0,
  border: "2px solid red",
  padding: "5px",
  backgroundColor: "#fff",
};

export const Cart: React.FC = () => {
  const { isEmpty, cart } = useLocalCart();
  const { isAuthenticated, userInfos } = useAuth();
  return (
    <div style={styles}>
      <ClientOnly fallback={<p>Your basket is empty.</p>}>
        <>
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
          {!isEmpty() && (
            <>
              <h5>
                Basket (Id:{cart.cartId}, State: {cart.state})
              </h5>
              <InnerCart basket={cart} />
              <p>
                <Link to={"/cart"}>See the cart</Link>
                <br />
                <Link to={"/checkout"}>Place the order</Link>
              </p>
            </>
          )}
        </>
      </ClientOnly>
    </div>
  );
};

const InnerCart: React.FC<{ basket: any }> = ({ basket }) => {
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

export const HydratedCart: React.FC = () => {
  const { remoteCart, loading } = useRemoteCart();
  const {
    isImmutable,
    cart: localCart,
    isEmpty,
    add: addToCart,
    remove: removeFromCart,
  } = useLocalCart();
  const { cart, total } = remoteCart || { cart: null, total: null };

  if (isEmpty()) {
    return null;
  }

  return (
    <ClientOnly>
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
                  {!isImmutable() && (
                    <button
                      onClick={() => {
                        removeFromCart(item.variant);
                      }}
                    >
                      {" "}
                      -{" "}
                    </button>
                  )}
                  <p>{item.quantity}</p>
                  {!isImmutable() && (
                    <button
                      onClick={() => {
                        addToCart(item.variant);
                      }}
                    >
                      {" "}
                      +{" "}
                    </button>
                  )}
                </div>
              </div>
            ))}
          {total && (
            <div className="flex flex-col gap-4 border-b-2 border-grey4 py-4 items-end">
              <div className="flex text-grey3 justify-between w-60">
                <p>Net</p>
                <p>€ {total.net}</p>
              </div>
              <div className="flex text-grey3 justify-between w-60">
                <p>Tax amount</p>
                <p>€ {total.taxAmount}</p>
              </div>
              <div className="flex font-bold text-xl justify-between w-60">
                <p>To pay</p>
                <p>€ {total.gross}</p>
              </div>
            </div>
          )}
          <div className="flex justify-between mt-10">
            <Link
              to="/"
              className="bg-grey py-2 px-5 text-center font-semibold"
            >
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
    </ClientOnly>
  );
};
