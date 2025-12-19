import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Filter, CheckCircle2 } from 'lucide-react';
import { createProductReview, resetReviewCreate } from '../../actions/productActions';

// Shadcn Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ProductReviews = ({ reviews, productId, onReviewSubmitted }) => {
  const dispatch = useDispatch();
  
  // Correct Redux selectors matching Profile.jsx pattern
  const { loading: reviewLoading, success, error: reviewError } = useSelector(
    (state) => state.reviewCreate
  );
  const { userInfo } = useSelector((state) => state.userLogin);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filterRating, setFilterRating] = useState('all');
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  // Reset form on successful submission
  useEffect(() => {
    if (success) {
      setNewReview({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      setTimeout(() => {
        dispatch(resetReviewCreate());
      }, 3000);
    }
  }, [success, dispatch, onReviewSubmitted]);

  const handleSubmitReview = () => {
    if (!userInfo) {
      alert('Please login to submit a review');
      return;
    }

    if (!newReview.title || !newReview.comment) {
      alert('Please fill in all required fields');
      return;
    }

    dispatch(createProductReview(productId, newReview));
  };

  const approvedReviews = reviews?.filter(r => r.is_approved) || [];
  
  // Filter reviews by rating
  const filteredReviews = filterRating === 'all' 
    ? approvedReviews 
    : approvedReviews.filter(r => r.rating === parseInt(filterRating));

  // Calculate statistics
  const averageRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: approvedReviews.filter(r => r.rating === rating).length,
    percentage: approvedReviews.length > 0 
      ? (approvedReviews.filter(r => r.rating === rating).length / approvedReviews.length) * 100 
      : 0,
  }));

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Status Messages */}
      {success && (
        <Alert className="border-black bg-white">
          <CheckCircle2 className="h-4 w-4 text-black" />
          <AlertDescription className="text-black text-sm">
            Review submitted successfully. It will appear after approval.
          </AlertDescription>
        </Alert>
      )}

      {reviewError && (
        <Alert className="border-black bg-white">
          <AlertDescription className="text-black text-sm">
            {reviewError}
          </AlertDescription>
        </Alert>
      )}

      {/* Review Summary Section */}
      <Card className="border border-black shadow-none bg-white">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Average Rating */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-black mb-2">
                  Customer Reviews
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-light text-black">
                    {averageRating}
                  </span>
                  <span className="text-sm text-gray-600">out of 5</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating)
                        ? 'fill-black stroke-black'
                        : 'fill-none stroke-black'
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-gray-600">
                Based on {approvedReviews.length} {approvedReviews.length === 1 ? 'review' : 'reviews'}
              </p>

              <Separator className="bg-gray-200" />

              {/* Write Review Button */}
              {userInfo ? (
                <Button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  disabled={reviewLoading}
                  className="w-full bg-black text-white hover:bg-gray-800 border-0 text-xs uppercase tracking-widest"
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </Button>
              ) : (
                <div className="text-center py-4 border border-black">
                  <p className="text-xs text-gray-600">
                    <a href="/login" className="text-black underline hover:no-underline">
                      Sign in
                    </a>{' '}
                    to write a review
                  </p>
                </div>
              )}
            </div>

            {/* Right: Rating Distribution */}
            <div className="lg:col-span-3 space-y-3">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-4">
                  <button
                    onClick={() => setFilterRating(rating.toString())}
                    className="flex items-center gap-2 min-w-[80px] hover:opacity-70 transition-opacity"
                  >
                    <span className="text-sm text-black">{rating}</span>
                    <Star className="w-4 h-4 fill-black stroke-black" />
                  </button>

                  <div className="flex-1 h-2 bg-gray-100 border border-gray-200 relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-black transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="text-sm text-gray-600 min-w-[40px] text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && userInfo && (
        <Card className="border border-black shadow-none bg-white">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm uppercase tracking-widest text-black mb-6">
                  Write Your Review
                </h3>
              </div>

              {/* Rating Selector */}
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest text-black">
                  Rating *
                </Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating })}
                      disabled={reviewLoading}
                      className="p-2 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= newReview.rating
                            ? 'fill-black stroke-black'
                            : 'fill-none stroke-black'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="bg-gray-200" />

              {/* Title */}
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest text-black">
                  Review Title *
                </Label>
                <Input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="Summarize your experience"
                  className="border-black bg-white text-black focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                  disabled={reviewLoading}
                />
              </div>

              {/* Comment */}
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest text-black">
                  Your Review *
                </Label>
                <Textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your thoughts about this product"
                  rows={6}
                  className="border-black bg-white text-black focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-sm"
                  disabled={reviewLoading}
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitReview}
                disabled={reviewLoading}
                className="w-full bg-black text-white hover:bg-gray-800 border-0 text-xs uppercase tracking-widest disabled:opacity-50"
              >
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter and Reviews List */}
      {approvedReviews.length > 0 && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'}
              {filterRating !== 'all' && ` with ${filterRating} stars`}
            </p>
            
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-[180px] border-black bg-white text-black focus:ring-0 focus:ring-offset-0">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent className="border-black bg-white">
                <SelectItem value="all" className="text-black cursor-pointer">All Ratings</SelectItem>
                <SelectItem value="5" className="text-black cursor-pointer">5 Stars</SelectItem>
                <SelectItem value="4" className="text-black cursor-pointer">4 Stars</SelectItem>
                <SelectItem value="3" className="text-black cursor-pointer">3 Stars</SelectItem>
                <SelectItem value="2" className="text-black cursor-pointer">2 Stars</SelectItem>
                <SelectItem value="1" className="text-black cursor-pointer">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <Card className="border border-black shadow-none bg-white">
                <CardContent className="p-8 text-center">
                  <p className="text-sm text-gray-600">
                    No reviews found with {filterRating} stars
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {approvedReviews.length === 0 && (
        <Card className="border border-black shadow-none bg-white">
          <CardContent className="p-12 text-center space-y-4">
            <Star className="w-12 h-12 mx-auto text-gray-300 stroke-black fill-none" />
            <div>
              <h3 className="text-sm uppercase tracking-widest text-black mb-2">
                No Reviews Yet
              </h3>
              <p className="text-sm text-gray-600">
                Be the first to review this product
              </p>
            </div>
            {userInfo && (
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-black text-white hover:bg-gray-800 border-0 text-xs uppercase tracking-widest"
              >
                Write the First Review
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Individual Review Card Component
const ReviewCard = ({ review }) => {
  const formattedDate = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="border border-black shadow-none bg-white hover:shadow-sm transition-shadow">
      <CardContent className="p-6 space-y-4">
        {/* Review Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* Stars */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? 'fill-black stroke-black'
                      : 'fill-none stroke-black'
                  }`}
                />
              ))}
            </div>

            {/* Title */}
            <h4 className="text-base font-medium text-black leading-tight">
              {review.title}
            </h4>
          </div>

          {/* Verified Badge */}
          {review.is_verified_purchase && (
            <Badge variant="outline" className="border-black text-black bg-white text-[10px] uppercase tracking-widest">
              Verified Purchase
            </Badge>
          )}
        </div>

        {/* Review Body */}
        <p className="text-sm leading-relaxed text-gray-700">
          {review.comment}
        </p>

        <Separator className="bg-gray-200" />

        {/* Review Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-black">
            {review.customer_name || 'Anonymous Customer'}
          </span>
          <span className="text-xs text-gray-500">
            {formattedDate}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductReviews;