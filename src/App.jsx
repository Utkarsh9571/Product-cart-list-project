import { useState } from "react";
import data from './data.json';

function DessertCart ({ item, cartItem, onUpdateGlobalCart }) {
  
  const isInCart = !!cartItem;
  const quantity =  cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    onUpdateGlobalCart(item, 1);
  }

  const handleIncreaseQuantity = () => {
      onUpdateGlobalCart(item, 1);
  }

  const handleDecreaseQuantity = () => {
        onUpdateGlobalCart(item, -1);
  }

  return(
    <div key={item.id} className="relative ">
      <img 
        src={item.image.mobile} 
        alt={item.category} 
        className={`rounded-xl mt-6 ${!isInCart ? 'border-0': 'border-2 border-projectRed'}` }
      />

      <div>
        {isInCart ? (
          <div 
            className="bg-projectRed flex justify-between w-1/2 p-3 rounded-full 
            absolute bottom-16 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={handleDecreaseQuantity}
              className="border-white border-2 rounded-full p-1 cursor-pointer"
              disabled={quantity <= 0}
              >
              <img src="public\assets\images\icon-decrement-quantity.svg" alt="icon decrement quantity" />
            </button>

            <span className="text-white text-md">{quantity}</span>
            
            <button
              onClick={handleIncreaseQuantity}
              className="border-white border-2 rounded-full p-1 cursor-pointer"
              >
              <img src="public\assets\images\icon-increment-quantity.svg" alt="icon increment quantity" />
            </button>
        </div>
      ) : (
        <button 
          onClick={handleAddToCart}
          className="flex w-1/2 justify-center p-3 pl-7 pr-7 gap-2 border border-rose500 justify-self-center font-medium bg-white rounded-full 
          absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bottom-16 hover:text-projectRed cursor-pointer hover:border-projectRed md:gap-1 md:pl-5 md:pr-5" 
          >
          <img src="public\assets\images\icon-add-to-cart.svg" alt="icon add to cart" />
          <h1 className="text-sm">Add to Cart</h1>
        </button>
      )}
      </div>
        <h2 className="text-sm font-medium text-rose500 mt-10">{item.category}</h2>
        <h3 className="text-md font-semibold text-rose900">{item.name}</h3>
        <h4 className= "font-semibold text-projectRed">{`${"$" + item.price.toFixed(2)}`}</h4>
      </div>
    )
}



export default function App() {
  const [items] = useState(data);
  const [cartItems, setCartItems] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleUpdateGlobalCart =(dessertItem, change) => {
    setCartItems(prevCartItems => {
      const existingItemIndex = prevCartItems.findIndex(cartItems => cartItems.id === dessertItem.id);

      if (existingItemIndex > -1) {
        const updatedCartItems = [...prevCartItems];
        updatedCartItems[existingItemIndex] = {
          ...updatedCartItems[existingItemIndex],
          quantity: updatedCartItems[existingItemIndex].quantity + change
        };
        
        if (updatedCartItems[existingItemIndex]. quantity <= 0) {
          return updatedCartItems.filter(item => item.id !== dessertItem.id);
        }
        return updatedCartItems;
      } else {
        if (change > 0) {
          return [...prevCartItems, { ...dessertItem, quantity: change }];
        }
        return prevCartItems;
      }
    });
  };

  const totalCartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  const totalOrderAmount = cartItems.reduce((total, item) => total + (item.quantity * item.price), 0);

  const handleConfirmOrder = () => {
    setShowConfirmation(true);
  }

  const handleStartNewOrder = () => {
    setShowConfirmation(false);
    setCartItems([]);
  }

  return (
    <section className="relative p-6 font-red-hat bg-rose50 sm:p-14 md:p-18">
    <h1 className="text-5xl font-bold mb-6">Desserts</h1>

    <div className="flex flex-col lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 lg:col-span-2 xl:col-span-3 gap-8">
      {items.map((item) => (
        <DessertCart 
          key={item.id} 
          item={item} 
          cartItem={cartItems.find(cartItems => cartItems.id === item.id)}
          onUpdateGlobalCart={handleUpdateGlobalCart}
        />
      ))}
    </div>

    <div className="bg-white mt-8 p-6 rounded-2xl flex-col justify-items-center
    lg:mt-0 lg:col-span-1 xl:col-span-1">
      <h1 className="text-projectRed text-2xl font-bold justify-self-start">
        Your Cart ({totalCartQuantity})
      </h1>

      {cartItems.length === 0 ? (
        <>
          <img src="public\assets\images\illustration-empty-cart.svg" alt="illustration empty cart" 
            className="mt-12 mb-6"/>
          <h2 className="text-rose500 font-semibold text-md" >
            Your added items will appear hear
          </h2>
        </>
      ) : (
        <div className="pt-4 w-full">
          {cartItems.map((cartItems) => (
            <div
              className="flex justify-between mb-3 pb-3 border-b border-rose300" 
              key={cartItems.id}>
              <div className="w-full">
                <h3 className="font-semibold text-base text-rose900">{cartItems.name}</h3>
                <div>
                  <span className="font-semibold text-sm text-projectRed">{cartItems.quantity}x</span>
                  <span className="ml-5 mr-3 text-sm font-medium text-rose400">{`@ $${cartItems.price.toFixed(2)}`}</span>
                  <span className="font-semibold text-sm text-rose500">{`$${(cartItems.quantity * cartItems.price).toFixed(2)}`}</span>
                </div>
              </div>

              <button
                  onClick={() => handleUpdateGlobalCart(cartItems, -cartItems.quantity)}
                >
                  <img 
                    src="public\assets\images\icon-remove-item.svg" 
                    alt="icon remove item" 
                    className="w-full border-rose300 border-2 rounded-full m-0.5 p-0.5
                    hover:border-rose900 cursor-pointer"/>
                </button>

            </div>
          ))}

            <div className="flex justify-between items-center">
              <span className="font-medium text-rose500">Order Total</span>
              <span className="text-2xl font-bold">{`$${cartItems.reduce((total, item) => total + (item.quantity * item.price), 0).toFixed(2)}`}</span>
            </div>

            <div className="flex justify-center gap-2 bg-rose50 p-4.5 rounded-2xl mt-6 mb-6">
              <img src="public\assets\images\icon-carbon-neutral.svg" alt="icon carbon neutral" />
              <h1 className="text-sm text-rose900">This is a <span className="font-semibold">carbon-neutral </span>delivery</h1>
            </div>

            <button 
              onClick={handleConfirmOrder}
              className="bg-projectRed rounded-full p-4 w-full text-lg text-white font-medium
              hover:bg-orange-900 cursor-pointer"
              >
              Confirm Order
            </button>
        </div>
      )}
       </div>
    </div>
    
       {showConfirmation && (
        <div className="fixed bottom-0 right-0 bg-black/50 h-full w-full">
          <div className="fixed bottom-0 left-0 p-7 bg-white w-full h-fit rounded-2xl 
          md:w-fit md:min-w-md md:h-2/3 md:bottom-1/6 md:left-1/5 lg:left-1/4 xl:left-1/3 md:overflow-scroll hide-scrollbar">
            <div>
              <img
                className="mb-5" 
                src="public\assets\images\icon-order-confirmed.svg" 
                alt="icon order confirmed" />
              <h1 className="font-bold text-4xl w-1/2">Order Confirmed</h1>
              <h2 className="font-medium mt-4 mb-4 text-rose400">We hope you enjoy your food!</h2>
              <div>
                <div className="bg-rose50 p-6 mb-12">
                  {cartItems.map((cartItems) => (
                  <div
                    className="flex items-center justify-between pb-5 border-b border-rose100"
                     key={cartItems.id}>  
                      <img 
                        className="w-1/5 rounded-md"
                        src={cartItems.image.thumbnail} 
                        alt="cart item thumbnail" />

                      <div className="w-1/2">
                        <p className="font-semibold text-md mb-1 text-left text-rose900">{cartItems.name}</p>
                        <p className="text-rose400 font-medium ">
                          <span className="text-projectRed font-semibold mr-3.5">
                            {cartItems.quantity}x
                          </span> 
                          @ ${cartItems.price.toFixed(2)}
                        </p>
                      </div>

                      <h1 className="font-semibold  text-lg text-rose900">{`$${(cartItems.quantity * cartItems.price).toFixed(2)}`}</h1>
                    </div>
                  ))}

                  <div className="flex justify-between items-center mt-6">
                    <span className="font-medium text-rose500">Order Total</span>
                    <span className="text-2xl font-bold">{`$${totalOrderAmount.toFixed(2)}`}</span>
                  </div>
                </div>
     
                <button 
                  onClick={handleStartNewOrder}
                  className="bg-projectRed rounded-full p-4 w-full text-lg text-white font-medium
                  hover:bg-orange-900 cursor-pointer"
                >
                  Start New Order
                </button>

              </div>
            </div>
          </div>
        </div>
        )}
    </section>
  )
}