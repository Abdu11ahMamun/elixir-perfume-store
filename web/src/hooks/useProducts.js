import { useCallback, useEffect, useRef, useState } from "react";
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getOfferProducts,
  getCategories,
  adaptProducts,
  adaptProduct,
} from "../services/productService";
import { FEATURED, REGULAR_PRODUCTS, COLLECTIONS, COMBO_PRODUCTS } from "../constants/brand";

// ─── useCategories ────────────────────────────────────────
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getCategories()
      .then((data) => {
        if (cancelled) return;
        // Map backend shape to frontend filter tab shape
        const mapped = [
          { id: "all", name: "All", slug: "all" },
          ...data.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
        ];
        setCategories(mapped);
      })
      .catch(() => {
        if (cancelled) return;
        // Fallback to static categories
        setCategories([
          { id: "all",        name: "All",        slug: "all" },
          { id: "for-him",    name: "For Him",     slug: "for-him" },
          { id: "for-her",    name: "For Her",     slug: "for-her" },
          { id: "luxury-oud", name: "Luxury Oud",  slug: "luxury-oud" },
          { id: "gift-sets",  name: "Gift Sets",   slug: "gift-sets" },
        ]);
        setError("Using offline categories");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { categories, loading, error };
}

// ─── useFeaturedProducts ──────────────────────────────────
export function useFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getFeaturedProducts()
      .then((data) => {
        if (cancelled) return;
        setProducts(adaptProducts(Array.isArray(data) ? data : data?.content || []));
      })
      .catch(() => {
        if (cancelled) return;
        // Fallback to static data
        setProducts(FEATURED);
        setError("Using offline data");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { products, loading, error };
}

// ─── useOfferProducts ─────────────────────────────────────
export function useOfferProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let cancelled = false;
    getOfferProducts()
      .then((data) => {
        if (cancelled) return;
        setProducts(adaptProducts(Array.isArray(data) ? data : data?.content || []));
      })
      .catch(() => {
        if (cancelled) return;
        setProducts(COMBO_PRODUCTS);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { products, loading };
}

// ─── useProductList ───────────────────────────────────────
// Used by Products page — paginated, filtered, searchable
export function useProductList({ categoryId, search, sort, page, size = 8 }) {
  const [products, setProducts]     = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  // Debounce search
  const searchTimer = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getProducts({ page, size, sort, categoryId, search: debouncedSearch })
      .then((data) => {
        if (cancelled) return;
        const content = data?.content || data || [];
        setProducts(adaptProducts(content));
        setTotalPages(data?.totalPages ?? 1);
        setTotal(data?.totalElements ?? content.length);
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        // Fallback
        setProducts(REGULAR_PRODUCTS);
        setTotalPages(1);
        setTotal(REGULAR_PRODUCTS.length);
        setError("Using offline data");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [categoryId, debouncedSearch, sort, page, size]);

  return { products, totalPages, total, loading, error };
}

// ─── useProductDetail ─────────────────────────────────────
export function useProductDetail(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    setLoading(true);

    getProductById(productId)
      .then((data) => {
        if (cancelled) return;
        setProduct(adaptProduct(data));
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Product not found");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [productId]);

  return { product, loading, error };
}