import { useState } from 'react';
import axios from 'axios';
import './ReviewForm.css';

function ReviewForm({ shopId, shopName, userName, onClose, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await axios.post(`http://localhost:5000/api/shops/${shopId}/reviews`, {
        user: userName,
        rating,
        comment: comment.trim()
      });
      setSuccess(true);
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      console.error('Review error:', err);
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        <button className="review-modal-close" onClick={onClose} aria-label="Close">×</button>

        {success ? (
          <div className="review-success">
            <span className="review-success-icon">🎉</span>
            <h3 className="review-success-title">Review Submitted!</h3>
            <p className="review-success-text">Thank you for your feedback on <strong>{shopName}</strong>.</p>
            <button className="review-success-btn" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <h2 className="review-modal-title">⭐ Leave a Review</h2>
            <p className="review-modal-subtitle">for {shopName}</p>

            <form className="review-form" onSubmit={handleSubmit}>
              <div className="review-field">
                <label>Rating</label>
                <div className="review-stars-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`review-star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`${star} star`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="review-rating-label">
                    {rating > 0 ? `${rating}/5` : 'Select rating'}
                  </span>
                </div>
              </div>

              <div className="review-field">
                <label htmlFor="review-comment">Comment (optional)</label>
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                />
              </div>

              {error && <p className="review-error">{error}</p>}

              <button
                type="submit"
                className="review-submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : '⭐ Submit Review'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ReviewForm;
