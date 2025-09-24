import { Id } from "./_generated/dataModel";
import { QueryCtx } from "./_generated/server";

async function getUserWithImage(ctx: QueryCtx, userId: Id<"users">) {
  const user = await ctx.db.get(userId);
  if (!user) return null;

  if (!user.imageUrl || user.imageUrl.startsWith("http")) {
    return user;
  }

  const url = await ctx.storage.getUrl(user.imageUrl as Id<"_storage">);
  return { ...user, imageUrl: url };
}

async function getMediaUrls(ctx: QueryCtx, mediaFiles: string[] | undefined) {
  if (!mediaFiles || mediaFiles.length === 0) return [];

  const urlPromises = mediaFiles.map((file) =>
    ctx.storage.getUrl(file as Id<"_storage">)
  );
  const results = await Promise.allSettled(urlPromises);

  return results
    .filter(
      (result): result is PromiseFulfilledResult<string> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value);
}
function extractMentions(content: string): Id<"users">[] {
  const mentionMatches = content.match(/@(\w+)/g);
  if (!mentionMatches) return [];

  // In a real implementation, you'd resolve usernames to user IDs
  // This is a simplified version
  return [];
}

function extractHashtags(content: string): string[] {
  const hashtagMatches = content.match(/#(\w+)/g);
  if (!hashtagMatches) return [];

  return hashtagMatches.map((tag) => tag.slice(1).toLowerCase());
}

export { extractHashtags, extractMentions, getMediaUrls, getUserWithImage };
