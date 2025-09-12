// Export all table definitions and types
export * from "./auth-model";
export * from "./search.model";
export * from "./favorites.model";
export * from "./brands.model";
export * from "./categories.model";
export * from "./filters/genders.model";
export * from "./filters/colors.model";
export * from "./filters/sizes.model";
export * from "./shoes.model";
export * from "./variants.model";
export * from "./images.model";
export * from "./reviews.model";
export * from "./orders.model";
export * from "./payments.model";

// IMPORTANT: Export ONLY the relations that actually exist
// Remove any that cause "export not found" errors
export { shoesRelations } from "./shoes.model";
export { shoeVariantsRelations } from "./variants.model";
export { categoriesRelations } from "./categories.model";
export { shoeImagesRelations } from "./images.model";
export { reviewsRelations } from "./reviews.model";
export { ordersRelations, orderItemsRelations } from "./orders.model";
export { paymentsRelations } from "./payments.model";
