import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }
  const body = await request.json();
  const { commentText, userId, listingId } = body;

  if (!commentText || !userId || !listingId) {
    return NextResponse.error();
  }

  const comment = await prisma.comment.create({
    data: {
      comment: commentText,
      listingId: listingId,
      userId: currentUser.id,
    },
  });

  return NextResponse.json(comment);
}
