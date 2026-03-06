"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  category: string;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i._id === item._id);

        if (existing) {
          set({
            items: items.map((i) =>
              i._id === item._id
                ? {
                    ...i,
                    quantity: i.quantity < i.stock ? i.quantity + 1 : i.quantity,
                  }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                ...item,
                quantity: 1,
              },
            ],
          });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item._id !== id),
        });
      },

      increaseQty: (id) => {
        set({
          items: get().items.map((item) =>
            item._id === id
              ? {
                  ...item,
                  quantity:
                    item.quantity < item.stock ? item.quantity + 1 : item.quantity,
                }
              : item
          ),
        });
      },

      decreaseQty: (id) => {
        const updated = get().items
          .map((item) =>
            item._id === id
              ? { ...item, quantity: Math.max(1, item.quantity - 1) }
              : item
          )
          .filter((item) => item.quantity > 0);

        set({ items: updated });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
    }),
    {
      name: "cafe-cart-storage",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version) => {
        if (!persistedState || version < 2) {
          return { items: [] };
        }
        return persistedState;
      },
    }
  )
);