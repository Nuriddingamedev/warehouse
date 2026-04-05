import { db } from "@/lib/db";
import { stockMovements, products } from "@/lib/schema";
import { desc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const limit = Number(req.nextUrl.searchParams.get("limit") || "50");

    // Get movements with product names
    const movements = await db
      .select({
        id: stockMovements.id,
        type: stockMovements.type,
        quantity: stockMovements.quantity,
        createdAt: stockMovements.createdAt,
        productName: products.name,
        productBarcode: products.barcode,
      })
      .from(stockMovements)
      .innerJoin(products, eq(stockMovements.productId, products.id))
      .orderBy(desc(stockMovements.createdAt))
      .limit(limit);

    // Get summary stats
    const [stats] = await db
      .select({
        totalIn: sql<number>`coalesce(sum(case when ${stockMovements.type} = 'IN' then ${stockMovements.quantity} else 0 end), 0)`,
        totalOut: sql<number>`coalesce(sum(case when ${stockMovements.type} = 'OUT' then ${stockMovements.quantity} else 0 end), 0)`,
        countIn: sql<number>`count(case when ${stockMovements.type} = 'IN' then 1 end)`,
        countOut: sql<number>`count(case when ${stockMovements.type} = 'OUT' then 1 end)`,
      })
      .from(stockMovements);

    return NextResponse.json({
      movements,
      stats: {
        totalIn: Number(stats.totalIn),
        totalOut: Number(stats.totalOut),
        countIn: Number(stats.countIn),
        countOut: Number(stats.countOut),
      },
    });
  } catch (error) {
    console.error("History API error:", error);
    return NextResponse.json(
      { movements: [], stats: { totalIn: 0, totalOut: 0, countIn: 0, countOut: 0 } },
      { status: 500 }
    );
  }
}
