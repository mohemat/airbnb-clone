import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }
  const body = await request.json();
  const { userRating, userId, listingId } = body;

  if (!userRating || !userId || !listingId) {
    return NextResponse.error();
  }

  const rating = await prisma.rating.upsert({
    where: {
      userId_listingId: {
        userId: currentUser.id,
        listingId: listingId,
      },
    },
    update: {
      rating: userRating,
    },
    create: {
      rating: userRating,
      user: {
        connect: { id: currentUser.id },
      },
      listing: {
        connect: { id: listingId },
      },
    },
  });

  return NextResponse.json(rating);
}
