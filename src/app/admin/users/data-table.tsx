"use client";
import { DataTable } from "@/app/admin/users/user-data-table";
import type { UserWithMediaAndBatches } from "./user-data-table";
import { NewUserModal } from "./new-user-modal";
interface DataTableProps {
  data: UserWithMediaAndBatches[];
}

export function UserDataTable({ data }: DataTableProps) {
  return (
    <div>
      <div className="mx-6 mb-4">
        <NewUserModal />
      </div>
      <DataTable data={data} />
    </div>
  );
}
