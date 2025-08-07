import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate fetching data from a database or external API
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  const data = {
    currentPrice: "$0.0075", // Example real-time price
    amountRaised: "$450,000", // Example real-time amount raised
    tokenValue: "1 NWIS = $0.0075", // Example real-time token value
  };

  return NextResponse.json(data);
}
