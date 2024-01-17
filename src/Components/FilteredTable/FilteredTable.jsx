/* eslint-disable react/prop-types */
import { Form, Table } from "react-bootstrap";
import { categories, shops } from "../../data/data";
import { useEffect, useRef, useState } from "react";
import Fuse from "fuse.js";
import _debounce from "lodash/debounce";

export function FilteredTable({ productList, setProductList }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [radioRef1,radioRef2,radioRef3] = [useRef(null),useRef(null),useRef(null)]
  const [filteredProductList, setFilteredProductList] = useState([...productList]);
  const [radioFilteredProductList, setRadioFilteredProductList] = useState([]);
  const fuse = new Fuse(productList, {
    keys: ["name"],
    includeScore: true,
    threshold: 0.4,
  });

  const debouncedSearch = _debounce((term) => {
    const results = fuse.search(term);
    const filteredProducts = results.map((result) => result.item);
    if(searchTerm != "")
    {   
        setFilteredProductList([...filteredProducts]);
        [radioRef1,radioRef2,radioRef3].forEach((ref)=>{
            ref.current.checked = false;
        })
        disableRadioButtons(true)
    }
    else
    {   
        setFilteredProductList([...filteredProducts,...radioFilteredProductList]);
        disableRadioButtons(false)
    }
  }, 1000);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  function handleFilteredShopChange(e, productId) {
    setProductList((prevProductList) => {
      return prevProductList.map((product) => {
        if (product.id === productId) {
          return { ...product, shop: e.target.value };
        }
        return product;
      });
    });
  }
  function handleFilteredCategoryChange(e,productId)
  {
    setProductList((prevProductList) => {
        return prevProductList.map((product) => {
          if (product.id === productId) {
            return { ...product, category: e.target.value };
          }
          return product;
        });
      });
  }
  function disableRadioButtons(disable) {
    radioRef1.current.disabled = disable;
    radioRef2.current.disabled = disable;
    radioRef3.current.disabled = disable;
  }
  function handleRadioChange(e) {
        if (e.target.id === "inline-radio-1") {
            setRadioFilteredProductList([...productList]);
          } else if (e.target.id === "inline-radio-2") {
            const filteredProducts = productList.filter((product) => product.isBought);
            setRadioFilteredProductList(filteredProducts);
          } else if (e.target.id === "inline-radio-3") {
            const filteredProducts = productList.filter((product) => !product.isBought);
            setRadioFilteredProductList(filteredProducts);
          }
  }
  return (
    <>
      <div className="d-flex flex-column justify-content-center mt-5">
        <div className="d-flex justify-content-center my-3">
          <input type="text" placeholder="Ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Form>
          {['radio'].map((type) => (
            <div key={`inline-${type}`} className="mb-3 d-flex justify-content-center">
              <Form.Check
                inline
                label="Tümü"
                name="group1"
                type={type}
                id={`inline-${type}-1`}
                className="mx-3"
                onClick={(e) => handleRadioChange(e)}
                ref={radioRef1}
              />
              <Form.Check
                inline
                label="Satın Alınanlar"
                name="group1"
                type={type}
                id={`inline-${type}-2`}
                className="mx-3"
                onClick={(e) => handleRadioChange(e)}
                ref={radioRef2}
              />
              <Form.Check
                inline
                label="Satın Alınmayanlar"
                name="group1"
                type={type}
                id={`inline-${type}-3`}
                className="mx-3"
                onClick={(e) => handleRadioChange(e)}
                ref={radioRef3}
              />
            </div>
          ))}
        </Form>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Shop</th>
          </tr>
        </thead>
        <tbody>
          {filteredProductList.map((list) => (
            <tr key={list.id}>
              <td>{list.name}</td>
              <td>
                  <select defaultValue={list.category} onChange={(e) => handleFilteredCategoryChange(e, list.id)}>
                  {categories.map((filteredCategory) => (
                    <option key={filteredCategory.id} value={filteredCategory.id}>
                      {filteredCategory.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select defaultValue={list.shop} onChange={(e) => handleFilteredShopChange(e, list.id)}>
                  {shops.map((filteredShop) => (
                    <option key={filteredShop.id} value={filteredShop.id}>
                      {filteredShop.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
