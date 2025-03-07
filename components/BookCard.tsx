import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IBook } from "@/database/Models/book.modle";
import { auth } from "@/auth";
import User from "@/database/Models/user.model";

const BookCard = async ({
  _id,
  title,
  genre,
  coverColor,
  coverUrl,
}: IBook) => {

  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null
  
  const user = await User.findOne({ _id: userId });
  const hasBorrowed = user?.borrowBooksIds?.some((id) => id.toString() === _id.toString());
  const isLoanedBook = hasBorrowed;
  
  return (
    <li className={cn(isLoanedBook && "xs:w-52 w-full")}>
      <Link
        href={`/books/${_id}`}
        className={cn(isLoanedBook && "w-full flex flex-col items-center")}
      >
        <BookCover coverColor={coverColor} coverUrl={coverUrl} />

        <div className={cn("mt-4", !isLoanedBook && "xs:max-w-40 max-w-28")}>
          <p className="book-title">{title}</p>
          <p className="book-genre">{genre}</p>
        </div>

        {isLoanedBook && (
          <div className="mt-3 w-full">
            <div className="book-loaned">
              <Image
                src="/icons/calendar.svg"
                alt="calendar"
                width={18}
                height={18}
                className="object-contain"
              />
              <p className="text-light-100">11 days left to return</p>
            </div>

            <Button className="bg-dark-600 mt-3 min-h-14 w-full font-bebas-neue text-base text-primary">Download receipt</Button>
          </div>
        )}
      </Link>
    </li>
  );
}

export default BookCard;