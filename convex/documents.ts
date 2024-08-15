import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

/* Create a document */
export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("You are not authenticated!");

    const userId = identity.subject;

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return document;
  },
});

/* Get all documents created */
export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("You are not authenticated!");

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

/* Archive a document and its children */
export const archive = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("You are not authenticated!");

    const userId = identity.subject;

    const documentExists = await ctx.db.get(args.id);

    if (!documentExists) throw new Error("Document cannot be found!");

    if (documentExists.userId !== userId)
      throw new Error("Unauthorized Action");

    /* Archive children of parent documents as well */
    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (let child of children) {
        await ctx.db.patch(child._id, { isArchived: true });

        await recursiveArchive(child._id);
      }
    };

    const document = await ctx.db.patch(args.id, { isArchived: true });
    recursiveArchive(args.id);

    return document;
  },
});

/* Get archived documents */
export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("You are not authenticated");

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return documents;
  },
});

export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("You are not authenticated");

    const userId = identity.subject;

    const documentExists = await ctx.db.get(args.id);

    if (!documentExists) throw new Error("Document cannot be found!");

    if (documentExists.userId !== userId)
      throw new Error("Unauthorized Action");

    /* Restore children of parents documents as well */
    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (let child of children) {
        await ctx.db.patch(child._id, { isArchived: false });

        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    if (documentExists.parentDocument) {
      const parent = await ctx.db.get(documentExists.parentDocument);

      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }

    const document = await ctx.db.patch(args.id, options);
    recursiveRestore(args.id);

    return document;
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("You are not authenticated");

    const userId = identity.subject;

    const documentExists = await ctx.db.get(args.id);

    if (!documentExists) throw new Error("Document cannot be found!");

    if (documentExists.userId !== userId)
      throw new Error("Unauthorized Action");

    const document = await ctx.db.delete(args.id);

    return document;
  },
});

export const getSeach = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("You are not connected");

    const userId = identity.subject;

    const documents = ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const document = await ctx.db.get(args.documentId);

    if (!document) throw new Error("Document cannot be Found");

    if (document.isPublished && !document.isArchived) return document;

    if (!identity) throw new Error("You are not authtenticated");

    const userId = identity.subject;

    if (document.userId !== userId) throw new Error("Unauthorized Action");

    return document;
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("You are not authenticated");

    const userId = identity.subject;
    const { id, ...rest } = args;

    const documentExists = await ctx.db.get(args.id);

    if (!documentExists) throw new Error("Document cannot be found");

    if (documentExists.userId !== userId)
      throw new Error("Unauthorized Action");

    const document = ctx.db.patch(args.id, { ...rest });

    return document;
  },
});
