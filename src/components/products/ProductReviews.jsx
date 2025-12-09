import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star } from 'lucide-react';
import { createProductReview, resetReviewCreate } from '../../actions/productActions';

const ProductReviews = ({ reviews, productId, onReviewSubmitted }) => {
  const dispatch = useDispatch();
  const { loading: reviewLoading, success, error: reviewError } = useSelector(
    (state) => state.reviewCreate
  );
  const { user } = useSelector((state) => state.userLogin || {});

  const [showReviewForm, setShowReviewForm] = useState(false);
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
      // Reload product details to show new review
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      // Reset success state after 3 seconds
      setTimeout(() => {
        dispatch(resetReviewCreate());
      }, 3000);
    }
  }, [success, dispatch, onReviewSubmitted]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    dispatch(createProductReview(productId, newReview));
  };

  const approvedReviews = reviews?.filter(r => r.is_approved) || [];

  return (
    <div className="max-w-4xl space-y-8">
      {/* Success Message */}
      {success && (
        <div className="border border-black bg-gray-50 p-4">
          <p className="text-xs uppercase tracking-widest">
            Review submitted successfully! It will appear after approval.
          </p>
        </div>
      )}

      {/* Error Message */}
      {reviewError && (
        <div className="border border-black bg-red-50 p-4">
          <p className="text-xs uppercase tracking-widest text-red-600">
            {reviewError}
          </p>
        </div>
      )}

      {/* Review Summary */}
      <div className="border border-black p-6 space-y-4">
        <h3 className="text-sm uppercase tracking-widest font-medium">Customer Reviews</h3>
        
        {approvedReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="space-y-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-light">
                  {(approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length).toFixed(1)}
                </span>
                <span className="text-xs text-gray-600">out of 5</span>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length)
                        ? 'fill-black stroke-black'
                        : 'fill-none stroke-black'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600">
                Based on {approvedReviews.length} {approvedReviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = approvedReviews.filter(r => r.rating === rating).length;
                const percentage = approvedReviews.length > 0 
                  ? (count / approvedReviews.length) * 100 
                  : 0;
                
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-16">
                      <span className="text-xs">{rating}</span>
                      <Star className="w-3 h-3 fill-black stroke-black" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 border border-black">
                      <div
                        className="h-full bg-black transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-600">No reviews yet. Be the first to review this product.</p>
        )}

        {/* Write Review Button */}
        {user ? (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="w-full md:w-auto px-6 py-3 border border-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            disabled={reviewLoading}
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        ) : (
          <p className="text-xs text-gray-600">
            Please <a href="/login" className="underline">login</a> to write a review.
          </p>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && user && (
        <form onSubmit={handleSubmitReview} className="border border-black p-6 space-y-6">
          <h3 className="text-sm uppercase tracking-widest font-medium">Write Your Review</h3>

          {/* Rating Selector */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest">Rating *</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating })}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      rating <= newReview.rating
                        ? 'fill-black stroke-black'
                        : 'fill-none stroke-black'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest">Review Title *</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              placeholder="Sum up your experience"
              className="w-full px-4 py-3 text-xs border border-black focus:outline-none focus:border-gray-600"
              required
              disabled={reviewLoading}
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest">Your Review *</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your thoughts about this product"
              rows="6"
              className="w-full px-4 py-3 text-xs border border-black focus:outline-none focus:border-gray-600 resize-none"
              required
              disabled={reviewLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={reviewLoading}
            className="w-full px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reviewLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {approvedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
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
    <div className="border border-black p-6 space-y-4">
      {/* Review Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-1">
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
          <h4 className="text-sm font-medium">{review.title}</h4>
        </div>
        {review.is_verified_purchase && (
          <span className="px-2 py-1 border border-black text-[9px] uppercase tracking-widest">
            Verified Purchase
          </span>
        )}
      </div>

      {/* Review Body */}
      <p className="text-xs leading-relaxed text-gray-600">{review.comment}</p>

      {/* Review Footer */}
      <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest">
        <span>{review.customer_name || 'Anonymous'}</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default ProductReviews;