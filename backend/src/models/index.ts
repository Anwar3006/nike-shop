// Export all table definitions and types
export * from "./auth-model.js";
export * from "./search.model.js";
export * from "./favorites.model.js";
export * from "./brands.model.js";
export * from "./categories.model.js";
export * from "./filters/genders.model.js";
export * from "./filters/colors.model.js";
export * from "./filters/sizes.model.js";
export * from "./shoes.model.js";
export * from "./variants.model.js";
export * from "./images.model.js";
export * from "./reviews.model.js";
export * from "./orders.model.js";
export * from "./payments.model.js";

// IMPORTANT: Export ONLY the relations that actually exist
// Remove any that cause "export not found" errors
export { shoesRelations } from "./shoes.model.js";
export { shoeVariantsRelations } from "./variants.model.js";
export { categoriesRelations } from "./categories.model.js";
export { shoeImagesRelations } from "./images.model.js";
export { reviewsRelations } from "./reviews.model.js";
export { ordersRelations, orderItemsRelations } from "./orders.model.js";
export { paymentsRelations } from "./payments.model.js";
