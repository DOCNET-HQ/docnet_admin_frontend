import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import {
  useHasReviewedHospitalQuery,
  useGetHospitalReviewsQuery,
  useCreateHospitalReviewMutation,
  useUpdateHospitalReviewMutation,
  useDeleteHospitalReviewMutation,
  useHasReviewedDoctorQuery,
  useGetDoctorReviewsQuery,
  useCreateDoctorReviewMutation,
  useUpdateDoctorReviewMutation,
  useDeleteDoctorReviewMutation,
  HospitalReview,
  DoctorReview
} from "@/lib/api/reviewsApi";
import { toast } from "sonner";

interface ReviewsCarouselProps {
  entityId: string;
  entityType: 'hospital' | 'doctor';
  readOnly?: boolean;
}

type ReviewType = HospitalReview | DoctorReview;

export default function ReviewsCarousel({ entityId, entityType, readOnly = false }: ReviewsCarouselProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewType | null>(null);

  // Dynamic API hooks based on entity type
  const { data: hasReviewedHospitalData } = useHasReviewedHospitalQuery(
    entityType === 'hospital' ? entityId : '',
    { skip: entityType !== 'hospital' || readOnly }
  );

  const { data: hasReviewedDoctorData } = useHasReviewedDoctorQuery(
    entityType === 'doctor' ? entityId : '',
    { skip: entityType !== 'doctor' || readOnly }
  );

  const { data: hospitalReviewsData, isLoading: hospitalReviewsLoading } = useGetHospitalReviewsQuery(
    { hospitalId: entityId, params: { page_size: 10 } },
    { skip: entityType !== 'hospital' }
  );

  const { data: doctorReviewsData, isLoading: doctorReviewsLoading } = useGetDoctorReviewsQuery(
    { doctorId: entityId, params: { page_size: 10 } },
    { skip: entityType !== 'doctor' }
  );

  const [createHospitalReview] = useCreateHospitalReviewMutation();
  const [updateHospitalReview] = useUpdateHospitalReviewMutation();
  const [deleteHospitalReview] = useDeleteHospitalReviewMutation();

  const [createDoctorReview] = useCreateDoctorReviewMutation();
  const [updateDoctorReview] = useUpdateDoctorReviewMutation();
  const [deleteDoctorReview] = useDeleteDoctorReviewMutation();

  // Determine which data to use based on entity type
  const hasReviewed = entityType === 'hospital'
    ? hasReviewedHospitalData?.has_reviewed || false
    : hasReviewedDoctorData?.has_reviewed || false;

  const reviews = entityType === 'hospital'
    ? hospitalReviewsData?.results || []
    : doctorReviewsData?.results || [];

  const isLoading = entityType === 'hospital'
    ? hospitalReviewsLoading
    : doctorReviewsLoading;

  // Reset form when dialog closes
  useEffect(() => {
    if (!isAddReviewOpen) {
      setRating(0);
      setComment("");
      setEditingReview(null);
    }
  }, [isAddReviewOpen]);

  const handleSubmitReview = async () => {
    if (readOnly) return;

    try {
      if (editingReview) {
        if (entityType === 'hospital') {
          await updateHospitalReview({
            reviewId: editingReview.id,
            rating,
            text: comment,
          }).unwrap();
        } else {
          await updateDoctorReview({
            reviewId: editingReview.id,
            rating,
            text: comment,
          }).unwrap();
        }
        toast.success("Review updated successfully!");
      } else {
        if (entityType === 'hospital') {
          await createHospitalReview({
            hospitalId: entityId,
            rating,
            text: comment,
          }).unwrap();
        } else {
          await createDoctorReview({
            doctorId: entityId,
            rating,
            text: comment,
          }).unwrap();
        }
        toast.success("Review submitted successfully!");
      }

      setIsAddReviewOpen(false);
    } catch (error: any) {
      if (error.data) {
        if (error.data.non_field_errors) {
          toast.error(error.data.non_field_errors[0]);
        } else if (error.data.text) {
          toast.error(error.data.text[0]);
        } else {
          toast.error("Failed to submit review. Please try again.");
        }
      }
    }
  };

  const handleEditReview = (review: ReviewType) => {
    if (readOnly) return;

    setEditingReview(review);
    setRating(review.rating);
    setComment(review.text);
    setIsAddReviewOpen(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (readOnly) return;

    try {
      if (entityType === 'hospital') {
        await deleteHospitalReview(reviewId).unwrap();
      } else {
        await deleteDoctorReview(reviewId).unwrap();
      }
      toast.success("Review deleted successfully!");
    } catch (error: any) {
      if (error.data) {
        toast.error(error.data.non_field_errors?.[0] || "Failed to delete review.");
      }
    }
  };

  const handleOpenAddReview = () => {
    if (readOnly) return;

    setEditingReview(null);
    setRating(0);
    setComment("");
    setIsAddReviewOpen(true);
  };

  // Helper function to render action buttons
  const renderActionButtons = () => {
    return (
      <div className="flex gap-2">
        {!readOnly && !hasReviewed && (
          <Button onClick={handleOpenAddReview} className="cursor-pointer">
            Add Review
          </Button>
        )}
        <AllReviewsDialog entityId={entityId} entityType={entityType} readOnly={readOnly} />
      </div>
    );
  };

  // Helper function to render dropdown menu for user's own reviews
  const renderReviewDropdown = (review: ReviewType) => {
    if (readOnly) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleEditReview(review)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Review
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDeleteReview(review.id)}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Review
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Reviews</h2>
          {!readOnly && <Button disabled>Loading...</Button>}
        </div>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {[1, 2, 3].map((i) => (
              <CarouselItem key={i} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardContent className="p-6">
                    {/* Review Header Skeleton */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                      </div>
                    </div>

                    {/* Rating Skeleton */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-8 ml-2" />
                    </div>

                    {/* Comment Skeleton */}
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                    </div>

                    {/* Date Skeleton */}
                    <div className="mt-4">
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Reviews</h2>
          {!readOnly && !hasReviewed && (
            <Button onClick={handleOpenAddReview} className="cursor-pointer">
              Add Review
            </Button>
          )}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              No reviews yet. {!readOnly && !hasReviewed && `Be the first to review this ${entityType}!`}
            </div>
          </CardContent>
        </Card>

        {/* Add Review Dialog - Only show if not readOnly */}
        {!readOnly && (
          <Dialog open={isAddReviewOpen} onOpenChange={setIsAddReviewOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Your Review</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Star Rating */}
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none cursor-pointer"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`h-8 w-8 ${star <= (hoverRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                          } transition-colors`}
                      />
                    </button>
                  ))}
                </div>

                {/* Comment Textarea */}
                <Textarea
                  placeholder={`Share your experience with this ${entityType}...`}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[120px]"
                />

                {/* Submit Button */}
                <Button
                  onClick={handleSubmitReview}
                  className="w-full cursor-pointer"
                  disabled={rating === 0 || comment.trim() === ""}
                >
                  Submit Review
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reviews</h2>
        {renderActionButtons()}
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {reviews.map((review) => (
            <CarouselItem key={review.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <Card className="h-full">
                <CardContent className="px-6">
                  {/* Review Header with three dots on same line */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={review.user.photo || ""} alt={review.user.name} />
                        <AvatarFallback>
                          {review.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{review.user.name}</h4>
                          {review.is_auth_user && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                                }`}
                            />
                          ))}
                          <span className="text-sm ml-2">{review.rating}.0</span>
                          {review.is_updated && (
                            <span className="text-xs ml-2">(edited)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Three dots menu for user's own reviews - only show if not readOnly */}
                    {!readOnly && review.is_auth_user && renderReviewDropdown(review)}
                  </div>

                  {/* Comment */}
                  <p className="text-sm leading-relaxed line-clamp-4">
                    {review.text}
                  </p>

                  {/* Date */}
                  <div className="mt-4 text-xs">
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>

      {/* Single Review Dialog for both Add and Edit - Only show if not readOnly */}
      {!readOnly && (
        <Dialog open={isAddReviewOpen} onOpenChange={setIsAddReviewOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingReview ? "Edit Your Review" : "Add Your Review"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Star Rating */}
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none cursor-pointer"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      className={`h-8 w-8 ${star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                        } transition-colors`}
                    />
                  </button>
                ))}
              </div>

              {/* Comment Textarea */}
              <Textarea
                placeholder={`Share your experience with this ${entityType}...`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[120px]"
              />

              {/* Submit Button */}
              <Button
                onClick={handleSubmitReview}
                className="w-full cursor-pointer"
                disabled={rating === 0 || comment.trim() === ""}
              >
                {editingReview ? "Update Review" : "Submit Review"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Updated AllReviewsDialog Component
function AllReviewsDialog({ entityId, entityType, readOnly = false }: {
  entityId: string;
  entityType: 'hospital' | 'doctor';
  readOnly?: boolean;
}) {
  const [page, setPage] = useState(1);

  const { data: hospitalReviewsData, isLoading: hospitalReviewsLoading } = useGetHospitalReviewsQuery(
    { hospitalId: entityId, params: { page, page_size: 10 } },
    { skip: entityType !== 'hospital' }
  );

  const { data: doctorReviewsData, isLoading: doctorReviewsLoading } = useGetDoctorReviewsQuery(
    { doctorId: entityId, params: { page, page_size: 10 } },
    { skip: entityType !== 'doctor' }
  );

  const reviews = entityType === 'hospital'
    ? hospitalReviewsData?.results || []
    : doctorReviewsData?.results || [];

  const isFetching = entityType === 'hospital' ? hospitalReviewsLoading : doctorReviewsLoading;
  const hasNext = entityType === 'hospital'
    ? !!hospitalReviewsData?.next
    : !!doctorReviewsData?.next;

  const loadMore = () => {
    if (hasNext && !isFetching) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View All</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>All Reviews</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4 pr-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="px-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.user.photo || ""} alt={review.user.name} />
                    <AvatarFallback>
                      {review.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{review.user.name}</h4>
                      {review.is_auth_user && (
                        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                            }`}
                        />
                      ))}
                      <span className="text-xs ml-1">{review.rating}.0</span>
                      {review.is_updated && (
                        <span className="text-xs ml-1">(edited)</span>
                      )}
                    </div>
                    <p className="text-sm">{review.text}</p>
                    <div className="text-xs mt-2">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {isFetching && (
            <div className="text-center py-4">Loading more reviews...</div>
          )}

          {hasNext && !isFetching && (
            <div className="text-center">
              <Button variant="outline" onClick={loadMore}>
                Load More
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
