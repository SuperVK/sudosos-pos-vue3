import { defineStore } from 'pinia';
import ApiService from "@/services/ApiService";
import { PointOfSaleWithContainersResponse } from "@sudosos/sudosos-client";
import { Product } from "@/types/Product";

export const usePointOfSaleStore = defineStore('pointOfSale', {
  state: () => ({
    pointOfSale: null as PointOfSaleWithContainersResponse | null,
  }),
  getters: {
    allProductCategories() {
      const categories = {};

      if (this.pointOfSale) {
        this.pointOfSale.containers.forEach((container) => {
          container.products.forEach((product) => {
            categories[product.category.id] = product.category.name;
          });
        });
      }
      const res = Object.entries(categories).map(([key, value]) => ({'id': String(key), 'name': value}))
      return res
    },
  },
  actions: {
    async fetchPointOfSale(id: number): Promise<void> {
      const response = await ApiService.pos.getSinglePointOfSale(id);
      this.pointOfSale = response.data;
    },
    getProduct(productId: number, revision: number, containerId: number): Product | undefined {
      if (this.pointOfSale) {
        const container = this.pointOfSale.containers.find(c => c.id === containerId);
        if (container) {
          return container.products.find(p => p.id === productId && p.revision === revision);
        }
      }
      return undefined;
    },
  },
});
