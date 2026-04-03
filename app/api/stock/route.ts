import { processStock } from "@/server/stock";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { barcode, quantity, mode, name } = body;

    if (!barcode || quantity === undefined || quantity === null || !mode) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      return NextResponse.json(
        { success: false, message: "Quantity must be greater than 0" },
        { status: 400 }
      );
    }

    if (!["IN", "OUT"].includes(mode)) {
      return NextResponse.json(
        { success: false, message: "Mode must be IN or OUT" },
        { status: 400 }
      );
    }

    const result = await processStock({
      barcode: String(barcode).trim(),
      quantity: Math.floor(qty),
      mode,
      name: name ? String(name) : undefined,
    });

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error("Stock API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
