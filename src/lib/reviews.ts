
import { supabase } from "@/integrations/supabase/client";
import { Review, ReviewVote } from "./types";

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
    return [];
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
