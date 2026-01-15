import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ message: 'Hello from the strike API!' });
}

export async function POST(request: Request) {
  // In a real application, you'd handle the strike logic here.
  console.log("A strike was registered!");
  return NextResponse.json({ success: true, message: 'Strike recorded.' });
}
