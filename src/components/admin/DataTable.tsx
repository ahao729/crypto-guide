"use client";

import { useState } from "react";
import Link from "next/link";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  editPath?: string | ((item: T) => string);
  createPath?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  searchValue?: string;
  emptyMessage?: string;
}

export function DataTable<T extends { id: number }>({
  columns,
  data,
  isLoading,
  onDelete,
  editPath,
  createPath,
  searchPlaceholder = "搜索...",
  onSearch,
  searchValue = "",
  emptyMessage = "暂无数据",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = (a as Record<string, unknown>)[sortKey];
    const bVal = (b as Record<string, unknown>)[sortKey];
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    const cmp = String(aVal).localeCompare(String(bVal), "zh-CN");
    return sortDir === "asc" ? cmp : -cmp;
  });

  const getEditHref = (item: T): string => {
    if (!editPath) return "#";
    if (typeof editPath === "function") return editPath(item);
    return `${editPath}/${item.id}`;
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        {onSearch && (
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="h-9 w-64 rounded-lg border border-input bg-background px-3 text-sm outline-none ring-gold/30 transition-colors focus:border-gold focus:ring-2"
          />
        )}
        {createPath && (
          <Link
            href={createPath}
            className="inline-flex h-9 items-center rounded-lg bg-gradient-gold px-4 text-sm font-medium text-white shadow-sm transition-all hover:brightness-110"
          >
            + 新建
          </Link>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`h-10 px-4 font-medium text-muted-foreground ${
                    col.sortable ? "cursor-pointer select-none hover:text-foreground" : ""
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span className="text-xs">{sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </span>
                </th>
              ))}
              {(editPath || onDelete) && (
                <th className="h-10 px-4 font-medium text-muted-foreground">操作</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length + ((editPath || onDelete) ? 1 : 0)}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  加载中...
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + ((editPath || onDelete) ? 1 : 0)}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sorted.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render
                        ? col.render(item)
                        : (item as Record<string, unknown>)[col.key] != null
                          ? String((item as Record<string, unknown>)[col.key])
                          : "—"}
                    </td>
                  ))}
                  {(editPath || onDelete) && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {editPath && (
                          <Link
                            href={getEditHref(item)}
                            className="rounded-md px-2.5 py-1 text-xs font-medium text-gold-dark transition-colors hover:bg-gold/10"
                          >
                            编辑
                          </Link>
                        )}
                        {onDelete && (
                          <>
                            {confirmDelete === item.id ? (
                              <span className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    onDelete(item.id);
                                    setConfirmDelete(null);
                                  }}
                                  className="rounded-md bg-destructive px-2.5 py-1 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
                                >
                                  确认
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                                >
                                  取消
                                </button>
                              </span>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(item.id)}
                                className="rounded-md px-2.5 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                              >
                                删除
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
