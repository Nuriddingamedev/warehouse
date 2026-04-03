import { db } from "@/lib/db";
import { products, stockMovements } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { sendLowStockAlert } from "./telegram";

type StockMode = "IN" | "OUT";

interface ProcessStockInput {
  barcode: string;
  quantity: number;
  mode: StockMode;
  name?: string;
}

interface ProcessStockResult {
  success: boolean;
  message: string;
  product?: {
    id: string;
    name: string;
    barcode: string;
    stock: number;
  };
}

export async function processStock(
  input: ProcessStockInput
): Promise<ProcessStockResult> {
  const { barcode, quantity, mode, name } = input;

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { success: false, message: "Quantity must be a positive integer" };
  }

  // Find existing product
  const [existing] = await db
    .select()
    .from(products)
    .where(eq(products.barcode, barcode))
    .limit(1);

  // --- OUT mode ---
  if (mode === "OUT") {
    if (!existing) {
      return { success: false, message: "Product not found" };
    }

    if (quantity > existing.stock) {
      return {
        success: false,
        message: `Not enough stock. Available: ${existing.stock}`,
      };
    }

    // Atomic: update stock + insert movement in single transaction
    const [updated] = await db.transaction(async (tx) => {
      const [upd] = await tx
        .update(products)
        .set({ stock: sql`${products.stock} - ${quantity}` })
        .where(eq(products.id, existing.id))
        .returning();

      await tx.insert(stockMovements).values({
        productId: existing.id,
        type: "OUT",
        quantity,
      });

      return [upd];
    });

    // Check low stock (fire-and-forget, non-blocking)
    if (updated.stock <= updated.minStock) {
      sendLowStockAlert(updated.name, updated.stock).catch(console.error);
    }

    return {
      success: true,
      message: `OUT: ${quantity} × ${updated.name}. Stock: ${updated.stock}`,
      product: {
        id: updated.id,
        name: updated.name,
        barcode: updated.barcode,
        stock: updated.stock,
      },
    };
  }

  // --- IN mode ---
  if (existing) {
    // Product exists — add stock (atomic transaction)
    const [updated] = await db.transaction(async (tx) => {
      const [upd] = await tx
        .update(products)
        .set({ stock: sql`${products.stock} + ${quantity}` })
        .where(eq(products.id, existing.id))
        .returning();

      await tx.insert(stockMovements).values({
        productId: existing.id,
        type: "IN",
        quantity,
      });

      return [upd];
    });

    return {
      success: true,
      message: `IN: ${quantity} × ${updated.name}. Stock: ${updated.stock}`,
      product: {
        id: updated.id,
        name: updated.name,
        barcode: updated.barcode,
        stock: updated.stock,
      },
    };
  }

  // Product does not exist — prompt for name
  if (!name || name.trim() === "") {
    return {
      success: false,
      message: "NEW_PRODUCT",
    };
  }

  // Create new product + first movement (atomic transaction)
  const [created] = await db.transaction(async (tx) => {
    const [prod] = await tx
      .insert(products)
      .values({
        barcode,
        name: name.trim(),
        stock: quantity,
      })
      .returning();

    await tx.insert(stockMovements).values({
      productId: prod.id,
      type: "IN",
      quantity,
    });

    return [prod];
  });

  return {
    success: true,
    message: `New product created: ${created.name}. Stock: ${created.stock}`,
    product: {
      id: created.id,
      name: created.name,
      barcode: created.barcode,
      stock: created.stock,
    },
  };
}
