import { getDiscountPercentage } from "../../utils/price";
import Button from "./Button";

export default function ProductCard({
  product,
  addToCart,
  openProductDetails,
}) {
  const discount = getDiscountPercentage(
    product.price,
    product.oldPrice
  );

  return (
    <article
      className="
        product-card
        bg-white
        rounded-[2rem]
        overflow-hidden
        shadow-sm
      "
    >
      <div className="relative h-[420px] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="card-img w-full h-full object-cover"
        />

        <div className="card-overlay" />

        {product.badge && (
          <span
            className="
              absolute
              top-4
              left-4
              z-10
              bg-[var(--ink)]
              text-white
              text-[10px]
              uppercase
              tracking-[0.2em]
              px-4
              py-2
              rounded-full
            "
          >
            {product.badge}
          </span>
        )}

        {discount && (
          <span
            className="
              absolute
              top-4
              right-4
              z-10
              bg-[var(--gold)]
              text-[var(--ink)]
              text-[10px]
              uppercase
              tracking-[0.2em]
              px-4
              py-2
              rounded-full
            "
          >
            -{discount}%
          </span>
        )}

        <div className="card-cta">
          <Button
            variant="ghost-light"
            onClick={() => openProductDetails(product)}
          >
            View Details
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[var(--gold)]">
            ★★★★★
          </span>

          <span className="text-sm text-[var(--mist)]">
            {product.rating}
          </span>

          <span className="text-sm text-[var(--mist)]">
            ({product.reviews})
          </span>
        </div>

        <p
          className="
            text-[11px]
            uppercase
            tracking-[0.25em]
            text-[var(--gold)]
            mb-2
          "
        >
          {product.category}
        </p>

        <h3
          className="
            font-display
            text-3xl
            font-light
            mb-2
          "
        >
          {product.name}
        </h3>

        <p
          className="
            text-sm
            text-[var(--mist)]
            mb-4
          "
        >
          {product.note}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {product.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="
                text-[10px]
                uppercase
                tracking-[0.18em]
                px-3
                py-2
                rounded-full
                bg-[var(--warm)]
              "
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-5">
          <span
            className="
              text-2xl
              font-medium
            "
          >
            {product.price}
          </span>

          {product.oldPrice && (
            <span
              className="
                text-sm
                line-through
                text-[var(--mist)]
              "
            >
              {product.oldPrice}
            </span>
          )}
        </div>

        <Button
          disabled={product.stock === "Sold out"}
          onClick={() => addToCart(product)}
          className="w-full justify-center"
        >
          {product.stock === "Sold out"
            ? "Sold Out"
            : "Add To Cart"}
        </Button>
      </div>
    </article>
  );
}