import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export default async function getAverageRating(params: IParams) {
  try {
    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
      throw new Error("Invalid ID");
    }

    const averageRating = await prisma.rating.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        listingId: listingId,
      },
    });

    if (!averageRating) {
      return null;
    }

    return averageRating._avg.rating;
  } catch (error: any) {
    throw new Error(error);
  }
}
