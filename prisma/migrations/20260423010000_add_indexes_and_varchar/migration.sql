ALTER TABLE "products" ALTER COLUMN "name" TYPE VARCHAR(255);
ALTER TABLE "products" ALTER COLUMN "description" TYPE VARCHAR(1000);
ALTER TABLE "products" ALTER COLUMN "category" TYPE VARCHAR(100);
ALTER TABLE "products" ALTER COLUMN "brand" TYPE VARCHAR(100);

CREATE INDEX "products_category_brand_idx" ON "products"("category", "brand");
CREATE INDEX "products_price_idx" ON "products"("price");
