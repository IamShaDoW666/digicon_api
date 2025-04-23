"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Batch } from "@prisma/client";

export const columns: ColumnDef<Batch>[] = [
  {
    accessorKey: "reference",
    header: "Reference",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => new Date(row.getValue("updatedAt")).toLocaleString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <button onClick={() => handleEdit(row.original)}>Edit</button>
        <button onClick={() => handleDelete(row.original.id)}>Delete</button>
      </div>
    ),
  },
];
function handleEdit(original: {
  name: string | null;
  id: string;
  reference: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}): void {
  throw new Error("Function not implemented.");
}

function handleDelete(id: string): void {
  throw new Error("Function not implemented.");
}
