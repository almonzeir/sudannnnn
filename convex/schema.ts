import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  medications: defineTable({
    name: v.string(),
    arabicName: v.string(),
    category: v.string(),
    description: v.string(),
    uses: v.array(v.string()),
    dosage: v.string(),
    sideEffects: v.array(v.string()),
    contraindications: v.array(v.string()),
    storage: v.string(),
    price: v.optional(v.string()),
    availability: v.string(), // 'متوفر' | 'غير متوفر' | 'محدود'
    rating: v.number(),
    image: v.optional(v.string()),
  }).searchIndex("search_name", {
    searchField: "name",
    filterFields: ["category"],
  }).searchIndex("search_arabic_name", {
    searchField: "arabicName",
    filterFields: ["category"],
  }),

  acuteConditions: defineTable({
    name: v.string(),
    symptoms: v.array(v.string()),
    homecare: v.array(v.string()),
    warning: v.string(),
  }),
});
