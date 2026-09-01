'use client';

import { deleteProduct } from './actions';

export default function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(event) => {
        const confirmed = window.confirm(`Delete “${productName}”?\n\nThis will permanently remove the product and its ProPrint Storage images.`);
        if (!confirmed) event.preventDefault();
      }}
    >
      <input type="hidden" name="product_id" value={productId} />
      <button type="submit" className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-black text-red-700 hover:bg-red-100">
        Delete Product
      </button>
    </form>
  );
}
