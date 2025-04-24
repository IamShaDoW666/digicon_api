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
    cell: () => (
      <div className="flex space-x-2">
        <button onClick={() => handleEdit()}>Edit</button>
        <button onClick={() => handleDelete()}>Delete</button>
      </div>
    ),
  },
];
function handleEdit(): void {
  throw new Error("Function not implemented.");
}

function handleDelete(): void {
  throw new Error("Function not implemented.");
}
