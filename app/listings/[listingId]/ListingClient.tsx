"use client";

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Range } from "react-date-range";
import { useRouter } from "next/navigation";
import { differenceInDays, eachDayOfInterval } from "date-fns";

import useLoginModal from "@/app/hooks/useLoginModal";
import {
  SafeComment,
  SafeListing,
  SafeReservation,
  SafeUser,
} from "@/app/types";
import { Rating } from "@prisma/client";

import Container from "@/app/components/Container";
import { categories } from "@/app/components/navbar/Categories";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingReservation from "@/app/components/listings/ListingReservation";
import ListingComment from "@/app/components/listings/ListingComment";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface ListingClientProps {
  reservations?: SafeReservation[];
  listing: SafeListing & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
  rating?: Rating;
  averageRatings?: number | null;
  listingComments?:
    | (SafeComment & {
        user: SafeUser;
      })[]
    | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
  rating,
  averageRatings,
  listingComments,
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation: any) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const category = useMemo(() => {
    return categories.find((items) => items.label === listing.category);
  }, [listing.category]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [userRating, setUserRating] = useState<Number>();
  const [ratingDetails, setRatingDetils] = useState();

  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    setIsLoading(true);

    axios
      .post("/api/reservations", {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing?.id,
      })
      .then(() => {
        toast.success("Listing reserved!");
        setDateRange(initialDateRange);
        router.push("/trips");
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);

  useEffect(() => {
    axios
      .get(`/api/rating/${listing.id}`)
      .then((response) => {
        setRatingDetils(response.data);
        router.refresh();
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }, [userRating, rating, listing?.id, currentUser?.id]);

  const onRating = useCallback(
    (userRating: number) => {
      if (!currentUser) {
        return loginModal.onOpen();
      }

      axios
        .post("/api/rating", {
          userRating: userRating,
          userId: currentUser.id,
          listingId: listing.id,
        })
        .then(() => {
          setUserRating(userRating);
          toast.success("You rated this property");
          router.refresh();
        })
        .catch(() => {
          toast.error("Something went wrong.");
        });
    },
    [listing?.id, currentUser]
  );

  const onComment = useCallback(
    (commentText: string) => {
      if (!currentUser) {
        return loginModal.onOpen();
      }
      axios
        .post("/api/comment", {
          commentText: commentText,
          userId: currentUser?.id,
          listingId: listing?.id,
        })
        .then(() => {
          toast.success("Your comment added to this property");
          router.refresh();
        })
        .catch(() => {
          toast.error("Something went wrong.");
        });
    },
    [listing?.id, currentUser?.id]
  );

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInDays(dateRange.endDate, dateRange.startDate);

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  return (
    <Container>
      <div
        className="
          max-w-screen-lg 
          mx-auto
        "
      >
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
          <div
            className="
              grid 
              grid-cols-1 
              md:grid-cols-7 
              md:gap-10 
              mt-6
            "
          >
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
              onRating={onRating}
              averageRatings={averageRatings}
              ratingDetails={ratingDetails}
            />
            <div
              className="
                order-first 
                mb-10 
                md:order-last 
                md:col-span-3
              "
            >
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
          <hr />
        </div>
        <ListingComment
          onComment={onComment}
          listingComments={listingComments}
        />
      </div>
    </Container>
  );
};

export default ListingClient;
