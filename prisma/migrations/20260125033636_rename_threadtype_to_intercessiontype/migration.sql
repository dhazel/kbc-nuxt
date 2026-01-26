-- Rename the table from thread_types to intercession_types
ALTER TABLE "thread_types" RENAME TO "intercession_types";

-- Rename the primary key constraint
ALTER TABLE "intercession_types" RENAME CONSTRAINT "thread_types_pkey" TO "intercession_types_pkey";

-- Rename the unique index on name
ALTER INDEX "thread_types_name_key" RENAME TO "intercession_types_name_key";