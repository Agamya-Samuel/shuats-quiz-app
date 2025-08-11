'use server';

import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { connectToDB } from '@/db';
import { userSubmissions } from '@/db/schema';
import * as dbSchema from '@/db/schema';

// Update time spent on a specific question
export async function updateQuestionTime(
  userId: number,
  questionId: number,
  totalTimeSpent: number, // Changed: now expects total time, not additional
) {
  try {
    // Validate inputs
    if (!userId || !questionId || totalTimeSpent < 0) {
      return {
        success: false,
        message: 'Invalid input parameters',
      };
    }

    // Reasonable time limit check (max 30 minutes per question)
    if (totalTimeSpent > 30 * 60) {
      console.warn(
        `Suspicious time update: ${totalTimeSpent}s for user ${userId}, question ${questionId}`,
      );
      return {
        success: false,
        message: 'Time spent exceeds reasonable limits',
      };
    }

    const db = (await connectToDB()) as unknown as NodePgDatabase<
      typeof dbSchema
    >;

    // Check if submission already exists
    const existingSubmission = await db.query.userSubmissions.findFirst({
      where: and(
        eq(userSubmissions.userId, userId),
        eq(userSubmissions.questionId, questionId),
      ),
    });

    if (existingSubmission) {
      // Update existing submission
      // Replace total time (don't add to existing)

      await db
        .update(userSubmissions)
        .set({ totalTimeSpent: totalTimeSpent })
        .where(
          and(
            eq(userSubmissions.userId, userId),
            eq(userSubmissions.questionId, questionId),
          ),
        );

      console.log(
        `Updated question time: user ${userId}, question ${questionId}, total: ${totalTimeSpent}s`,
      );
    } else {
      // Create new submission with just time tracking (no answer yet)
      await db.insert(userSubmissions).values({
        userId,
        questionId,
        option: '', // Empty option for time-only tracking
        totalTimeSpent: totalTimeSpent,
      });

      console.log(
        `Created question time entry: user ${userId}, question ${questionId}, ${totalTimeSpent}s`,
      );
    }

    return {
      success: true,
      message: 'Question time updated successfully',
    };
  } catch (error) {
    console.error('Error updating question time:', error);
    return {
      success: false,
      message: 'Failed to update question time',
    };
  }
}

// Batch update multiple question times
export async function batchUpdateQuestionTimes(
  userId: number,
  questionTimes: Array<{ questionId: number; timeSpent: number }>,
) {
  try {
    if (!userId || !Array.isArray(questionTimes)) {
      return {
        success: false,
        message: 'Invalid input parameters',
      };
    }

    const db = (await connectToDB()) as unknown as NodePgDatabase<
      typeof dbSchema
    >;

    // Process each question time update
    const results = await Promise.allSettled(
      questionTimes.map(async ({ questionId, timeSpent }) => {
        if (timeSpent <= 0 || timeSpent > 30 * 60) {
          throw new Error(
            `Invalid time for question ${questionId}: ${timeSpent}s`,
          );
        }

        // Check if submission exists
        const existingSubmission = await db.query.userSubmissions.findFirst({
          where: and(
            eq(userSubmissions.userId, userId),
            eq(userSubmissions.questionId, questionId),
          ),
        });

        if (existingSubmission) {
          // Update existing - replace total time
          await db
            .update(userSubmissions)
            .set({ totalTimeSpent: timeSpent })
            .where(
              and(
                eq(userSubmissions.userId, userId),
                eq(userSubmissions.questionId, questionId),
              ),
            );
          return { questionId, updated: true, totalTime: timeSpent };
        } else {
          // Create new
          await db.insert(userSubmissions).values({
            userId,
            questionId,
            option: '',
            totalTimeSpent: timeSpent,
          });
          return { questionId, updated: true, totalTime: timeSpent };
        }
      }),
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(
      `Batch update completed: ${successful} successful, ${failed} failed for user ${userId}`,
    );

    return {
      success: true,
      message: `Updated ${successful} question times`,
      details: {
        successful,
        failed,
        results: results.map((r) =>
          r.status === 'fulfilled' ? r.value : { error: r.reason.message },
        ),
      },
    };
  } catch (error) {
    console.error('Error in batch update question times:', error);
    return {
      success: false,
      message: 'Failed to batch update question times',
    };
  }
}

// Get all question times for a user
export async function getUserQuestionTimes(userId: number) {
  try {
    if (!userId) {
      return {
        success: false,
        message: 'Invalid user ID',
      };
    }

    const db = (await connectToDB()) as unknown as NodePgDatabase<
      typeof dbSchema
    >;

    const submissions = await db.query.userSubmissions.findMany({
      where: eq(userSubmissions.userId, userId),
      columns: {
        questionId: true,
        totalTimeSpent: true,
      },
    });

    const questionTimes = submissions
      .filter((s) => s.totalTimeSpent && s.totalTimeSpent > 0)
      .map((s) => ({
        questionId: s.questionId!,
        totalTimeSpent: s.totalTimeSpent!,
      }));

    return {
      success: true,
      questionTimes,
    };
  } catch (error) {
    console.error('Error getting user question times:', error);
    return {
      success: false,
      message: 'Failed to get question times',
    };
  }
}
