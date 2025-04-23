"use client";

import { useState } from "react";
import { DataTable } from "@/app/admin/batches/batch-data-table";
import type { BatchWithMediaAndCreatedBy } from "@/components/section-cards";
interface DataTableProps {
  data: BatchWithMediaAndCreatedBy[];
}

export function BatchDataTable({ data }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((batch) =>
    batch.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search by reference..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 ml-6 p-2 border rounded"
      />
      <DataTable data={filteredData} />
    </div>
  );
}
