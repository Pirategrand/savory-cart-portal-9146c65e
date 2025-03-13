
import { supabase } from "@/integrations/supabase/client";
import { Review, ReviewVote } from "./types";

// Sample review data for demonstration purposes
const sampleReviews: Review[] = [
  {
    id: "sample1",
    user_id: "sample-user-1",
    restaurant_id: "r1",
    rating: 5,
    content: "The burgers here are amazing! I tried the Classic Cheeseburger and it was juicy and flavorful. The fries were also perfectly crispy. Will definitely order again!",
    created_at: "2023-06-15T14:30:00Z",
    updated_at: "2023-06-15T14:30:00Z",
    user_profile: {
      first_name: "Sarah",
      last_name: "Johnson"
    }
  },
  {
    id: "sample2",
    user_id: "sample-user-2",
    restaurant_id: "r1",
    rating: 4,
    content: "Great food but delivery was a bit slow. The Crispy Chicken Sandwich was excellent though - crispy on the outside and tender inside. Would recommend trying their loaded fries too!",
    created_at: "2023-07-22T18:45:00Z",
    updated_at: "2023-07-22T18:45:00Z",
    user_profile: {
      first_name: "Michael",
      last_name: "Chen"
    }
  },
  {
    id: "sample3",
    user_id: "sample-user-3",
    restaurant_id: "r1",
    rating: 5,
    content: "This place never disappoints! I've ordered from here multiple times and the quality is always consistent. The loaded fries are to die for!",
    created_at: "2023-08-05T20:10:00Z",
    updated_at: "2023-08-05T20:10:00Z",
    user_profile: {
      first_name: "Jessica",
      last_name: "Patel"
    }
  },
  {
    id: "sample4",
    user_id: "sample-user-4",
    restaurant_id: "r1",
    rating: 3,
    content: "Food is good but portions are a bit small for the price. I ordered the burger and while it tasted great, I was still hungry afterward.",
    created_at: "2023-09-12T12:20:00Z",
    updated_at: "2023-09-12T12:20:00Z",
    user_profile: {
      first_name: "David",
      last_name: "Wilson"
    }
  },
  {
    id: "sample5",
    user_id: "sample-user-5",
    restaurant_id: "r1",
    rating: 5,
    content: "Absolutely loved their vegetarian options! The service was fast and the food arrived hot. Their customer service is also excellent - they quickly resolved an issue with my order.",
    created_at: "2023-10-03T19:05:00Z",
    updated_at: "2023-10-03T19:05:00Z",
    user_profile: {
      first_name: "Aisha",
      last_name: "Ahmed"
    }
  },
  // Sample reviews for r2 (Pasta Paradise)
  {
    id: "sample6",
    user_id: "sample-user-1",
    restaurant_id: "r2",
    rating: 5,
    content: "The Spaghetti Carbonara is the best I've ever had! Authentic Italian flavors and generous portions. Worth every penny!",
    created_at: "2023-05-10T17:30:00Z",
    updated_at: "2023-05-10T17:30:00Z",
    user_profile: {
      first_name: "Sarah",
      last_name: "Johnson"
    }
  },
  {
    id: "sample7",
    user_id: "sample-user-3",
    restaurant_id: "r2",
    rating: 4,
    content: "Great Italian food! The Margherita Pizza had the perfect thin crust and fresh toppings. Only giving 4 stars because delivery was a bit delayed.",
    created_at: "2023-07-05T19:15:00Z",
    updated_at: "2023-07-05T19:15:00Z",
    user_profile: {
      first_name: "Jessica",
      last_name: "Patel"
    }
  },
  // Sample reviews for r3 (Sushi Supreme)
  {
    id: "sample8",
    user_id: "sample-user-2",
    restaurant_id: "r3",
    rating: 5,
    content: "The freshest sushi in town! California Roll was perfect and the Salmon Nigiri melts in your mouth. Highly recommend!",
    created_at: "2023-08-18T20:45:00Z",
    updated_at: "2023-08-18T20:45:00Z",
    user_profile: {
      first_name: "Michael",
      last_name: "Chen"
    }
  },
  {
    id: "sample9",
    user_id: "sample-user-5",
    restaurant_id: "r3",
    rating: 5,
    content: "Amazing sushi! Everything was fresh, well-prepared, and beautifully presented. The miso soup is a must-try!",
    created_at: "2023-09-27T18:30:00Z",
    updated_at: "2023-09-27T18:30:00Z",
    user_profile: {
      first_name: "Aisha",
      last_name: "Ahmed"
    }
  },
  // Sample reviews for other restaurants
  {
    id: "sample10",
    user_id: "sample-user-4",
    restaurant_id: "r4",
    rating: 4,
    content: "Authentic Mexican tacos! Flavorful, fresh ingredients, and good portion sizes. The salsa is incredible!",
    created_at: "2023-10-05T13:20:00Z",
    updated_at: "2023-10-05T13:20:00Z",
    user_profile: {
      first_name: "David",
      last_name: "Wilson"
    }
  }
];

// Function to get sample reviews for a restaurant
const getSampleReviewsForRestaurant = (restaurantId: string): Review[] => {
  return sampleReviews.filter(review => review.restaurant_id === restaurantId);
};

export const getReviewsByRestaurantId = async (restaurantId: string): Promise<Review[]> => {
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      *,
      user_profile:profiles(first_name, last_name)
    `)
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return getSampleReviewsForRestaurant(restaurantId);
  }

  // If no real reviews are found, return sample reviews
  if (!reviews || reviews.length === 0) {
    return getSampleReviewsForRestaurant(restaurantId);
  }

  return reviews as unknown as Review[];
};

export const getReviewVotes = async (reviewIds: string[], userId?: string): Promise<Map<string, number>> => {
  if (!reviewIds.length) return new Map();

  const { data: votes, error } = await supabase
    .from('review_votes')
    .select('review_id, is_helpful')
    .in('review_id', reviewIds);

  if (error) {
    console.error('Error fetching votes:', error);
    return new Map();
  }

  // Count helpful votes for each review
  const voteCountMap = new Map<string, number>();
  votes.forEach(vote => {
    if (vote.is_helpful) {
      const currentCount = voteCountMap.get(vote.review_id) || 0;
      voteCountMap.set(vote.review_id, currentCount + 1);
    }
  });

  return voteCountMap;
};

export const getUserVotes = async (reviewIds: string[], userId: string): Promise<Map<string, boolean>> => {
  if (!reviewIds.length || !userId) return new Map();

  const { data: userVotes, error } = await supabase
    .from('review_votes')
    .select('review_id, is_helpful')
    .in('review_id', reviewIds)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user votes:', error);
    return new Map();
  }

  // Map user votes by review_id
  const userVoteMap = new Map<string, boolean>();
  userVotes.forEach(vote => {
    userVoteMap.set(vote.review_id, vote.is_helpful);
  });

  return userVoteMap;
};

export const submitReview = async (
  restaurantId: string,
  rating: number,
  content: string,
  userId: string
): Promise<Review | null> => {
  const { data: review, error } = await supabase
    .from('reviews')
    .insert([
      {
        restaurant_id: restaurantId,
        rating,
        content,
        user_id: userId
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error submitting review:', error);
    return null;
  }

  return review as unknown as Review;
};

export const updateReview = async (
  reviewId: string,
  rating: number,
  content: string
): Promise<Review | null> => {
  const { data: review, error } = await supabase
    .from('reviews')
    .update({
      rating,
      content,
      updated_at: new Date().toISOString()
    })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) {
    console.error('Error updating review:', error);
    return null;
  }

  return review as unknown as Review;
};

export const deleteReview = async (reviewId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) {
    console.error('Error deleting review:', error);
    return false;
  }

  return true;
};

export const voteReview = async (
  reviewId: string,
  userId: string,
  isHelpful: boolean
): Promise<boolean> => {
  // Check if user already voted
  const { data: existingVote } = await supabase
    .from('review_votes')
    .select('id, is_helpful')
    .eq('review_id', reviewId)
    .eq('user_id', userId)
    .single();

  if (existingVote) {
    // Update existing vote
    const { error } = await supabase
      .from('review_votes')
      .update({ is_helpful: isHelpful })
      .eq('id', existingVote.id);

    if (error) {
      console.error('Error updating vote:', error);
      return false;
    }
  } else {
    // Insert new vote
    const { error } = await supabase
      .from('review_votes')
      .insert([
        {
          review_id: reviewId,
          user_id: userId,
          is_helpful: isHelpful
        }
      ]);

    if (error) {
      console.error('Error adding vote:', error);
      return false;
    }
  }

  return true;
};

export const removeVote = async (reviewId: string, userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('review_votes')
    .delete()
    .eq('review_id', reviewId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error removing vote:', error);
    return false;
  }

  return true;
};
