import React, { useState, useEffect } from "react";
import { getProductInfo } from "../../api/product.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { deleteItemFromCartRoute } from "../../api/cart.js";
import { host } from "../../api/host.js";
import { toast } from "react-toastify";
import s from "./cartitem.module.css";

const CartProduct = ({ cartItem, onItemDelete, index, isOrderPage }) => {
  const [product, setProduct] = useState(null);

  const navigate = useNavigate();

  // fetching product
  useEffect(() => {
    const fetchProduct = async () => {
      const response = await axios.get(`${getProductInfo}/${cartItem.product}`);

      setProduct(response?.data);
    };

    fetchProduct();
  }, [cartItem]);

  const deleteItem = async () => {
    try {
      const response = await axios.post(
        deleteItemFromCartRoute,
        {
          productId: cartItem?.product,
        },
        { withCredentials: true }
      );

      // this will update products in cart in backend
      onItemDelete();

      // success message
      toast.success("item deleted");
    } catch (error) {
      toast.error(error.message || error.response.message);
    }
  };

  return (
    product && (
      <div className={s.cart_product_main}>
        <section>
          {index === 0 && (
            <h4 className={s.cart_product_head}>PRODUCT DETAILS</h4>
          )}
          <div className={s.cart_prdouct_img_head_container}>
            <div
              className={s.cart_product_img}
              onClick={() => navigate(`/product/${product?._id}`)}
            >
              <img
                src={`${host}/${product?.image[0]}`}
                alt={product?.name}
                loading="lazy"
              />
            </div>
            <div className={s.head_delete_btn}>
              <h5>{product?.name}</h5>
              {!isOrderPage && <button onClick={deleteItem}>Delete</button>}
            </div>
          </div>
        </section>
        <section>
          {index === 0 && <h4 className={s.cart_product_head}>QUANTITY</h4>}
          <div className={s.cart_product_quanity_change}>
            <div>{cartItem?.quantity}</div>
          </div>
        </section>
        <section>
          {index === 0 && <h4 className={s.cart_product_head}>PRICE</h4>}
          <h5>₹{product?.price}</h5>
        </section>
        <section>
          {index === 0 && <h4 className={s.cart_product_head}>TOTAL</h4>}
          <h5>{product?.price * cartItem?.quantity}</h5>
        </section>
      </div>
    )
  );
};

export default CartProduct;
