/* eslint-disable react/prop-types */
import { shops } from "../../data/data";

export function ShopSelect({handleShopSelect,product})
{
    return (
        <select onChange={handleShopSelect} value={product.shop}>
            <option>Market seçiniz</option>
            {shops.map((shop)=>(
                <option key={shop.id} value={shop.id}>{shop.name}</option>
            ))}
      </select>
    )
}