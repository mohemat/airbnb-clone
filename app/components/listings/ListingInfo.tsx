"use client";

import dynamic from "next/dynamic";
import { IconType } from "react-icons";

import Rating from "@mui/material/Rating";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";

import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";

const Map = dynamic(() => import("../Map"), {
  ssr: false,
});

interface ListingInfoProps {
  user: SafeUser;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  category:
    | {
        icon: IconType;
        label: string;
        description: string;
      }
    | undefined;
  locationValue: string;
  onRating: (userRating: number) => void;
  averageRatings?: number | null;
  ratingDetails?:
    | {
        id: string;
        listingId: string;
        rating: number;
        userId: string;
      }
    | null
    | undefined;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  locationValue,
  onRating,
  averageRatings,
  ratingDetails,
}) => {
  const { getByValue } = useCountries();
  const roundedRating = Math.round(averageRatings!);
  const coordinates = getByValue(locationValue)?.latlng;

  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div
          className="
            text-xl 
            font-semibold 
            flex 
            flex-row 
            items-center
            gap-2
          "
        >
          <div>Hosted by {user?.name}</div>
          <Avatar src={user?.image} />
        </div>

        {ratingDetails ? (
          <div
            className="
          flex 
          flex-row 
          items-center 
          gap-4 
          font-light
          text-neutral-500
        "
          >
            <Rating
              name="simple-controlled"
              value={ratingDetails["rating"]}
              onChange={(event, newValue) => {
                if (newValue === null) {
                  onRating(ratingDetails["rating"]);
                } else {
                  onRating(newValue!);
                }
              }}
            />
            <div>
              You already rated this property with {ratingDetails["rating"]}{" "}
              starts
            </div>
          </div>
        ) : (
          <Rating
            name="simple-controlled"
            value={roundedRating}
            onChange={(event, newValue) => {
              if (newValue === null) {
                onRating(roundedRating);
              } else {
                onRating(newValue!);
              }
            }}
          />
        )}

        <div
          className="
            flex 
            flex-row 
            items-center 
            gap-4 
            font-light
            text-neutral-500
          "
        >
          <div>{guestCount} guests</div>
          <div>{roomCount} rooms</div>
          <div>{bathroomCount} bathrooms</div>
        </div>
      </div>
      <hr />
      {category && (
        <ListingCategory
          icon={category.icon}
          label={category?.label}
          description={category?.description}
        />
      )}
      <hr />
      <div
        className="
      text-lg font-light text-neutral-500"
      >
        {description}
      </div>
      <hr />
      <Map center={coordinates} />
    </div>
  );
};

export default ListingInfo;
