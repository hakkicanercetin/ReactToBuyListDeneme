/* eslint-disable react/prop-types */
import { categories } from "../../data/data";

export function CategorySelect({handleCategorySelect,product})
{
    return (
        <select onChange={handleCategorySelect} value={product.category}>
            <option>Kategori seçin</option>
            {categories.map((category)=>(
                <option key={category.id} value={category.id}>{category.name}</option>
            ))}
      </select>
    )
}