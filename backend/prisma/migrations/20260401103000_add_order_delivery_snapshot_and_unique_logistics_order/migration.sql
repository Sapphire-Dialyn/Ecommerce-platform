ALTER TABLE "Order"
ADD COLUMN "addressId" TEXT,
ADD COLUMN "recipientName" TEXT,
ADD COLUMN "recipientPhone" TEXT,
ADD COLUMN "deliveryAddress" TEXT,
ADD COLUMN "selectedLogisticsPartnerId" TEXT,
ADD COLUMN "selectedLogisticsPartnerName" TEXT;

ALTER TABLE "LogisticsOrder"
ALTER COLUMN "pickupAddress" DROP NOT NULL;

CREATE UNIQUE INDEX "LogisticsOrder_orderId_key" ON "LogisticsOrder"("orderId");
