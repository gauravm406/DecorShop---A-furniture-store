import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { getProductInfo } from "../../api/product.js";
import { useParams } from "react-router-dom";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { StarRating } from "../../components/index.js";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCartRoute } from "../../api/cart.js";
import { toast } from "react-toastify";
import { addCartItems } from "../../store/slices/cart.js";
import { host } from "../../api/host.js";
import "react-toastify/dist/ReactToastify.css";
import s from "./product.module.css";

const Product = () => {
  const [product, setProduct] = useState();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [imageSrc, setImageSrc] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // userinfo
  const userInfo = useSelector((state) => state.user.userInfo);

  // product id from params
  const { id } = useParams();

  // set image src on first render imagesrc will be chnages once user click on different img
  useEffect(() => {
    setImageSrc(product?.image[0]);
  }, [product]);

  // fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${getProductInfo}/${id}`);
        setProduct(response?.data);
      } catch (error) {
        toast(error?.message || error?.response?.data?.message);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // increment quantiy
  const incrementQuant = () => {
    setSelectedQuantity((prev) => {
      if (prev >= product?.countInStock) {
        return product?.countInStock;
      } else {
        return prev + 1;
      }
    });
  };

  // decrement quantity
  const decrementQuant = () => {
    setSelectedQuantity((prev) => {
      if (prev <= 1) {
        return 1;
      } else {
        return prev - 1;
      }
    });
  };

  // add to cart btn handler
  const handleAddToCartBtn = async () => {
    setIsLoading(true);
    if (userInfo && product) {
      try {
        const addToCartResponse = await axios.post(
          addToCartRoute,
          {
            userId: userInfo._id,
            productId: product._id,
            quantity: selectedQuantity,
            price: product.price,
          },
          { withCredentials: true }
        );

        // dispatch it to store
        if (addToCartResponse) {
          dispatch(addCartItems(addToCartResponse?.data?.cartItems));
        }

        toast.success(addToCartResponse?.data?.message);
      } catch (error) {
        toast.error("Failed to add item");
      } finally {
        setIsLoading(false);
      }
    } else {
      navigate("/register");
    }
  };

  return product ? (
    <>
      {/* SEO CONFIGURATIONS */}
      <Helmet>
        <title>{`${product.name} - DecorShop.com`}</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={`${product.name} - DecorShop.com`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image[0]} />
      </Helmet>

      <div className={s.prodduct_main}>
        <section className={s.product_images_column}>
          <div className={s.product_p_image_container}>
            <img src={`${host}/${imageSrc}`} alt={product?.name} />
          </div>
          <div className={s.images_select}>
            {product?.image?.map((ele, index) => (
              <div
                className={`${s.products_p_p_image_container} ${
                  imageSrc === ele && s.active_p
                }`}
                key={index}
                onClick={() => setImageSrc(ele)}
              >
                <img src={`${host}/${ele}`} alt={product?.name} />
              </div>
            ))}
          </div>
        </section>
        <section>
          {product.countInStock > 0 ? (
            <button className={`${s.stock_btn} ${s.stock_btn_green}`}>
              In Stock
            </button>
          ) : (
            <button className={`${s.stock_btn} ${s.stock_btn_red}`}>
              Out of Stock
            </button>
          )}

          <h4 className={s.product_p_name}>{product.name}</h4>

          <div className={s.rating_and_review}>
            <span>
              <StarRating rating={product?.rating} />
            </span>
            <span className={s.product_rating}>{product.rating}</span>
            <span className={s.divider}>|</span>
            <span className={s.numreviews}>{product.numReviews} Reviews</span>
          </div>

          <p className={s.product_p_description}>{product.description}</p>

          <h1 className={s.product_p_price}>₹ {product.price}</h1>

          {product.countInStock > 0 && (
            <>
              <div className={s.quantity_select}>
                <p>QUANTITY :</p>
                <div className={s.quantity_select_value_btn}>
                  <span>{selectedQuantity}</span>
                  <div>
                    <button onClick={incrementQuant}>
                      <IoIosArrowUp />
                    </button>
                    <button onClick={decrementQuant}>
                      <IoIosArrowDown />
                    </button>
                  </div>
                </div>
              </div>

              {/* add to cart btn */}
              <button
                className={s.add_to_cart_btn}
                onClick={handleAddToCartBtn}
              >
                {isLoading ? (
                  <span className={s.loader}></span>
                ) : (
                  <>
                    <AiOutlineShoppingCart size={20} />
                    <span className={s.add_to_cart_btn_desc}>ADD TO CART</span>
                  </>
                )}
              </button>
            </>
          )}
        </section>
      </div>
    </>
  ) : (
    <div className="loader-container">
      <span className="loader-green"></span>
    </div>
  );
};

export default Product;
