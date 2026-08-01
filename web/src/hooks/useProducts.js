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
import { REGULAR_PRODUCTS } from "../constants/brand";

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
          ...(data || []).map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
        ];
        setCategories(mapped);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        // No hardcoded fallback — keep just the "All" tab so filtering
        // degrades gracefully instead of showing fabricated categories.
        setCategories([{ id: "all", name: "All", slug: "all" }]);
        setError(err.message || "Unable to load categories.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { categories, loading, error };
}

// ─── useHomeCategories ────────────────────────────────────
// Raw category list for the homepage "Explore Categories" grid —
// only categories actually returned by the backend, no synthetic
// "All" entry and no hardcoded fallback data.
export function useHomeCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getCategories()
      .then((data) => {
        if (cancelled) return;
        setCategories(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setCategories([]);
        setError(err.message || "Unable to load categories.");
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
        const content = Array.isArray(data) ? data : data?.content || [];
        // "Suitable" = has at least one active, purchasable size (sizes[]
        // already excludes inactive/deleted sizes — enforced by the backend).
        const suitable = adaptProducts(content).filter((p) => p.sizes.length > 0);
        setProducts(suitable.slice(0, 4));
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setProducts([]);
        setError(err.message || "Unable to load featured fragrances.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { products, loading, error };
}

// ─── useOfferProducts ─────────────────────────────────────
// Real combo/offer products only — no dummy fallback on error, matching
// useFeaturedProducts/useHomeCategories' pattern of degrading to an empty
// list plus an error flag rather than substituting fabricated data.
export function useOfferProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let cancelled = false;
    getOfferProducts()
      .then((data) => {
        if (cancelled) return;
        const content = Array.isArray(data) ? data : data?.content || [];
        setProducts(adaptProducts(content));
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setProducts([]);
        setError(err.message || "Unable to load offers.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { products, loading, error };
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