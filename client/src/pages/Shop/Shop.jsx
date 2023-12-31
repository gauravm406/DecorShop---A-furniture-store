import React, { useState, useEffect, useRef } from "react";
import "./shop.css";
import { getAllProducts } from "../../api/product";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { host } from "../../api/host";
import { toast } from "react-toastify";
import {
  getUniqueCategoriesRoute,
  getUniqueBrandsRoute,
} from "../../api/product";

const Shop = () => {
  const [products, setProducts] = useState();
  const [filteredProducts, setFilteredProduct] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState(["all"]);
  const [brands, setBrands] = useState(["all"]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [isShipping, setIsShipping] = useState(false);
  const [sortByValue, setSortByValue] = useState("Price (Lowest)");
  const [currPage, setCurrPage] = useState(1);
  const [showFilters, setShowfilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const navigate = useNavigate();

  // sorting filters
  const sortByFilters = [
    "Price (Lowest)",
    "Price (Highest)",
    "Name (A-Z)",
    "Name (Z-A)",
  ];

  // fetching products
  useEffect(() => {
    fecthProducts();
  }, [selectedCategory, selectedBrand, isShipping, currPage]);

  // fetching products
  useEffect(() => {
    const debounce = setTimeout(() => fecthProducts(), 1000);

    return () => clearTimeout(debounce);
  }, [searchQuery, selectedPrice]);

  // fetch products function
  const fecthProducts = async () => {
    setIsLoading(true);

    // seacrh keyword
    let keyword = searchQuery;
    if (searchQuery.length <= 0) {
      keyword = "default";
    }

    try {
      const response = await axios.get(
        `${getAllProducts}/${keyword}/${selectedCategory}/${selectedBrand}/${selectedPrice}/${isShipping}/${currPage}`
      );

      setProducts(response?.data?.products);
      setTotalPages(response.data.pages);
      setTotalProducts(response.data.totalProducts);
    } catch (error) {
      toast.error(error.response.data.message || error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // fetching unique categories
  useEffect(() => {
    const fetchUniqueCategories = async () => {
      try {
        const response = await axios.get(getUniqueCategoriesRoute);

        setCategories(["all", ...response.data.unique]);
      } catch (error) {
        toast.error(error.response.data.message || error.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };

    fetchUniqueCategories();
  }, []);

  // fetching unique brands
  useEffect(() => {
    const fetchUniqueBrands = async () => {
      try {
        const response = await axios.get(getUniqueBrandsRoute);

        setBrands(["all", ...response.data.unique]);
      } catch (error) {
        toast.error(error.response.data.message || error.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };

    fetchUniqueBrands();
  }, []);

  // sorting filters
  useEffect(() => {
    if (products) {
      let tempProducts = [...products];

      // sort by filter
      if (sortByValue == "Price (Lowest)") {
        tempProducts.sort((a, b) => {
          return a.price - b.price;
        });
      } else if (sortByValue == "Price (Highest)") {
        tempProducts.sort((a, b) => {
          return b.price - a.price;
        });
      } else if (sortByValue == "Name (A-Z)") {
        tempProducts.sort((a, b) => {
          let nameX = a.name.toLowerCase();
          let nameY = b.name.toLowerCase();
          return nameX.localeCompare(nameY);
        });
      } else if (sortByValue == "Name (Z-A)") {
        tempProducts.sort((a, b) => {
          let nameX = a.name.toLowerCase();
          let nameY = b.name.toLowerCase();
          return nameY.localeCompare(nameX);
        });
      }

      setFilteredProduct([...tempProducts]);
    }
  }, [products, sortByValue]);

  const handleAllClear = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedPrice(0);
    setIsShipping(false);
    setSortByValue("Price (Lowest)");
  };

  return (
    <div className="shop-main">
      <section
        className={
          showFilters
            ? "shop-filters-container"
            : "shop-filters-container-inactive"
        }
      >
        <div className="shop-filters-head">
          <h2>FILTER BY</h2>
          <button onClick={handleAllClear}>Clear All</button>
        </div>

        <div className="shop-filters-searchbar">
          <input
            type="text"
            placeholder="...Search product"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrPage(1);
            }}
          />
          <IoSearchOutline size={22} />
        </div>

        <h4 className="shop-category-head">Categories</h4>
        {categories?.map((cat, index) => (
          <p
            key={index}
            className={
              selectedCategory === cat
                ? "active-category shop-category-option"
                : "shop-category-option"
            }
            onClick={() => {
              setSelectedCategory(cat);
              setCurrPage(1);
            }}
          >
            {cat}
          </p>
        ))}

        <div className="shop-select-container">
          <h4 className="shop-brand-head">Brand</h4>
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setCurrPage(1);
            }}
          >
            {brands?.map((brand, index) => (
              <option key={index} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className="shop-price-container">
          <h4 className="shop-brand-head">Price</h4>
          <input
            type="range"
            min={0}
            max={100000}
            onChange={(e) => {
              setSelectedPrice(e.target.value);
              setCurrPage(1);
            }}
            value={selectedPrice}
          />
          <p>₹{selectedPrice}</p>
        </div>

        <div className="shop-checkbox-container">
          <input
            type="checkbox"
            onChange={() => {
              setIsShipping(!isShipping);
              setCurrPage(1);
            }}
            checked={isShipping == true}
          />{" "}
          <span>Shipping</span>
        </div>
      </section>

      <section className="shop-product-conatainer">
        <div className="shop-show-filter-container">
          <button onClick={() => setShowfilters(!showFilters)}>Filters</button>
        </div>
        <div className="sort-filter-container">
          <div className="shop-p-length-head">
            <p>{totalProducts} products found</p>
          </div>

          <div className="shop-horizontal">
            <hr />
          </div>

          <div className="shop-sort-filter">
            <p>sort by</p>
            <select
              value={sortByValue}
              onChange={(e) => setSortByValue(e.target.value)}
            >
              {sortByFilters?.map((ele, index) => (
                <option key={index} value={ele}>
                  {ele}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!isLoading && products ? (
          <>
            <div className="shop-products-container">
              {filteredProducts?.map((product, index) => {
                return (
                  <div
                    className="product-card"
                    onClick={() => navigate(`/product/${product._id}`)}
                    key={index}
                  >
                    <div className="product-image-container">
                      <img
                        src={`${host}/${product?.image[0]}`}
                        key={index}
                        className="product-image"
                        alt={product?.name}
                        loading="lazy"
                      />
                    </div>
                    <p className="product-name">{product.name}</p>
                    <p className="product-price">₹{product.price}</p>
                  </div>
                );
              })}
            </div>
            <div className="shop-pagination-container">
              <button onClick={() => setCurrPage(1)}>
                <MdOutlineKeyboardDoubleArrowLeft />
              </button>
              <button
                onClick={() => {
                  if (currPage <= 1) {
                    setCurrPage(1);
                  } else {
                    setCurrPage(currPage - 1);
                  }
                }}
              >
                <MdOutlineKeyboardArrowLeft />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNum) => {
                  return (
                    pageNum >= currPage - 1 &&
                    pageNum <= currPage + 1 && (
                      <button
                        key={pageNum}
                        className={
                          pageNum === currPage
                            ? "active-page-btn"
                            : "inactive-page-btn"
                        }
                        onClick={() => setCurrPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    )
                  );
                }
              )}
              <button
                onClick={() => {
                  if (currPage >= totalPages) {
                    setCurrPage(totalPages);
                  } else {
                    setCurrPage(currPage + 1);
                  }
                }}
              >
                <MdOutlineKeyboardArrowRight />
              </button>
              <button onClick={() => setCurrPage(totalPages)}>
                <MdOutlineKeyboardDoubleArrowRight />
              </button>
            </div>
          </>
        ) : (
          <div className="loader-container">
            <span className="loader-green"></span>
          </div>
        )}
      </section>
    </div>
  );
};

export default Shop;
