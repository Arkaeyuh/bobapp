'use client'
import { useCart, Item, Ingredient} from '@/components/cartContext'
import Link from 'next/link';
// To use the context, need the following three things
// 'use client'
// import { useCart, Item, Ingredient} from '@/components/cartContext'
// const {cart, addToCart, removeFromCart}  = useCart()
// Top 2 should be at beginning of file. Last one should be inside the export default function

export default function Test() {
  const {cart, addToCart, removeFromCart}  = useCart();

  // Made up item just for testing
  const itemToAdd:Item = {
    name: "Classic Tea",
    itemid: 1,
    price: "1.00",
    category: "Tea",
    quantity: 1,
    ingredients: [{
      name:"Tea Leaves",
      ingredientid:2
    }]
  }

  const handleAddToCart = () => {    
    addToCart(itemToAdd)
  };

  const handleRemoveFromCart = () => {
    removeFromCart(0); // Removes index 0, which is the first element in the cart
  }

  function printLength(): string{
    if(cart.length>0)
    {
        console.log(cart)
        return ""+cart.length;
    }
    else
    {
      return "nothing in cart";
    }
  }

  return (
    <div>
      <h2 id="header2">{printLength()}</h2>
      <button onClick={() => console.log(cart)}>view cart</button>

      <button onClick={() => handleAddToCart()}>Add to cart</button>
      <button  onClick={() => handleRemoveFromCart()}>Remove from cart</button>
      {/* <Link href="/test2">CLICK ME</Link> */}
    </div>
  );
}