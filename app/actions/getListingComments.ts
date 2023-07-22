import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export default async function getListingComments(params: IParams) {
  try {
    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
      throw new Error("Invalid ID");
    }

    const listingComments = await prisma.comment.findMany({
      where: {
        listingId: listingId,
      },
      include: {
        user: true,
      },
    });

    if (!listingComments) {
      return null;
    }

    const safeListingComments = listingComments.map((listingComments) => ({
      ...listingComments,
      createdAt: listingComments.createdAt.toISOString(),
      user: {
        ...listingComments.user,
        createdAt: listingComments.user.createdAt.toISOString(),
        updatedAt: listingComments.user.updatedAt.toISOString(),
        emailVerified:
          listingComments.user.emailVerified?.toISOString() || null,
      },
    }));

    return safeListingComments;
  } catch (error: any) {
    throw new Error(error);
  }
}
