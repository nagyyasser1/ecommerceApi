import { sequelize } from "../models/index.js";
import asyncHandler from "express-async-handler";
import STATUS_CODES from "../constants/STATUS_CODES.js";

const { NOT_FOUND, CREATED, INTERNAL_SERVER_ERROR, BAD_REQUEST, OK, FORBIDDEN } = STATUS_CODES;

const addReview = asyncHandler(async (req, res) => {
  const { rating, comment, productId } = req.body;

  try {
    // Check if the product exists
    const existingProduct = await sequelize.models.Product.findOne({
      where: {
        id: productId,
      },
    });

    if (!existingProduct) {
      return res
        .status(NOT_FOUND)
        .json({ message: "Product does not exist!" });
    }

    // Create a new review
    const newReview = await sequelize.models.Review.create({
      rating,
      comment,
      UserId: req.user.id,
      ProductId: productId,
    });

    return res
      .status(CREATED)
      .json(newReview);
  } catch (error) {
    console.error("Error adding new review:", error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

const deleteReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const isAdmin = req.user.isAdmin;
  const reviewId = req.body.reviewId;

  if (!reviewId) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "All fields required." });
  }

  try {
    const review = await sequelize.models.Review.finsequelize.modelsyPk(reviewId);

    if (!review) {
      return res
        .status(NOT_FOUND)
        .json({ message: "Review not found." });
    }

    // Check if the user is the owner of the review or is an admin
    if (userId === review.userId || isAdmin) {
      // If yes, delete the review
      await review.destroy();
      return res
        .status(OK)
        .json({ message: "Review deleted successfully." });
    } else {
      return res
        .status(FORBIDDEN)
        .json({ message: "Unauthorized to delete this review." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

const updateReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { reviewId, rating, comment } = req.body;

  if (!reviewId || !rating || !comment) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "updated data are required." });
  }

  try {
    const review = await sequelize.models.Review.finsequelize.modelsyPk(reviewId);

    if (!review) {
      return res
        .status(NOT_FOUND)
        .json({ message: "Review not found." });
    }

    // Check if the user is the owner of the review
    if (userId === review.userId) {
      // If yes, update the review with the data
      review.set({
        rating: rating || review.rating,
        comment: comment || review.comment,
      });
      await review.save();
      return res
        .status(OK)
        .json({ message: "Review updated successfully." });
    } else {
      return res
        .status(FORBIDDEN)
        .json({ message: "Unauthorized to update this review." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

export {
  addReview,
  deleteReview,
  updateReview,
};
