import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Rating,
  Divider,
} from "@mui/material";
import { Star, AccessTime } from "@mui/icons-material";

const CustomerReviews = ({ reviews }) => {
  return (
    <div className="reviews-container mt-10">
      <Typography variant="h5" color="textPrimary" gutterBottom>
        Customer Reviews
      </Typography>
      {reviews?.length ? (
        reviews.map((review, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <div
                className="review-header"
                style={{ display: "flex", alignItems: "center" }}
              >
                {/* Reviewer Avatar */}
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  {review.reviewerName.charAt(0)}
                </Avatar>
                {/* Reviewer Name and Rating */}
                <div style={{ flex: 1 }}>
                  <Typography variant="h6">{review.reviewerName}</Typography>
                  <Rating
                    name={`rating-${index}`}
                    value={review.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                    icon={<Star fontSize="inherit" />}
                  />
                </div>
                {/* Review Date */}
                <Typography variant="body2" color="textSecondary">
                  <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                  {new Date(review.date).toLocaleDateString()}
                </Typography>
              </div>
              {/* Review Text */}
              <Typography variant="body1" color="textSecondary" mt={2}>
                {review.comment}
              </Typography>
            </CardContent>
            {index < reviews.length - 1 && <Divider />}
          </Card>
        ))
      ) : (
        <Typography variant="body1" color="textSecondary">
          No reviews available for this product.
        </Typography>
      )}
    </div>
  );
};

export default CustomerReviews;
