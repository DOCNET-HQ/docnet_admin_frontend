"use client"

import * as React from "react"
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconGripVertical,
    IconLayoutColumns,
    IconPlus,
} from "@tabler/icons-react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Search } from "lucide-react";

// Generic type for data with required id field
export interface BaseTableData {
    id: number | string
    [key: string]: any
}

interface DataTableProps<TData extends BaseTableData> {
    data: TData[]
    columns: ColumnDef<TData>[]
    enableDragDrop?: boolean
    enableRowSelection?: boolean
    enableColumnVisibility?: boolean
    enablePagination?: boolean
    enableSearch?: boolean
    searchPlaceholder?: string
    searchValue?: string
    onSearchChange?: (value: string) => void
    onDataChange?: (data: TData[]) => void
    onRowsSelected?: (rows: TData[]) => void
    showAddButton?: boolean
    onAddClick?: () => void
    addButtonLabel?: string
    pageSize?: number
    currentPage?: number
    totalPages?: number
    onPageChange?: (page: number) => void
    isLoading?: boolean
    totalCount?: number
}

// Drag handle component
function DragHandle({ id }: { id: number | string }) {
    const { attributes, listeners } = useSortable({
        id,
    })

    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-7 hover:bg-transparent cursor-grab active:cursor-grabbing"
        >
            <IconGripVertical className="text-muted-foreground size-3" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    )
}

// Draggable row component
function DraggableRow<TData extends BaseTableData>({
    row
}: {
    row: Row<TData>
}) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    })

    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

export function DataTable<TData extends BaseTableData>({
    data: initialData,
    columns: userColumns,
    enableDragDrop = false,
    enableRowSelection = false,
    enableColumnVisibility = true,
    enablePagination = true,
    enableSearch = true,
    searchPlaceholder = "Search",
    searchValue: externalSearchValue,
    onSearchChange,
    onDataChange,
    onRowsSelected,
    showAddButton = false,
    onAddClick,
    addButtonLabel = "Add Row",
    pageSize = 10,
    currentPage: externalCurrentPage,
    totalPages: externalTotalPages,
    onPageChange,
    isLoading = false,
    totalCount,
}: DataTableProps<TData>) {
    const [data, setData] = React.useState(() => initialData)
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [internalPagination, setInternalPagination] = React.useState({
        pageIndex: 0,
        pageSize: pageSize,
    })

    const sortableId = React.useId()
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    // Use external pagination if provided, otherwise use internal
    const pagination = React.useMemo(() => {
        if (externalCurrentPage !== undefined && onPageChange) {
            return {
                pageIndex: externalCurrentPage - 1, // Convert to zero-based
                pageSize: pageSize,
            }
        }
        return internalPagination
    }, [externalCurrentPage, internalPagination, pageSize, onPageChange])

    const handlePaginationChange = React.useCallback((updater: any) => {
        const newPagination = typeof updater === 'function' ? updater(pagination) : updater
        
        if (onPageChange && externalCurrentPage !== undefined) {
            // Notify parent of page change (convert back to one-based)
            onPageChange(newPagination.pageIndex + 1)
        } else {
            setInternalPagination(newPagination)
        }
    }, [pagination, onPageChange, externalCurrentPage])

    // Handle external search value changes
    React.useEffect(() => {
        if (externalSearchValue !== undefined) {
            setGlobalFilter(externalSearchValue)
        }
    }, [externalSearchValue])

    const handleSearchChange = React.useCallback((value: string) => {
        setGlobalFilter(value)
        if (onSearchChange) {
            onSearchChange(value)
        }
    }, [onSearchChange])

    // Build columns with optional drag and select columns
    const columns = React.useMemo<ColumnDef<TData>[]>(() => {
        const cols: ColumnDef<TData>[] = []

        // Add drag column if enabled
        if (enableDragDrop) {
            cols.push({
                id: "drag",
                header: () => null,
                cell: ({ row }) => <DragHandle id={row.original.id} />,
                enableSorting: false,
                enableHiding: false,
            })
        }

        // Add select column if enabled
        if (enableRowSelection) {
            cols.push({
                id: "select",
                header: ({ table }) => (
                    <div className="flex items-center justify-center">
                        <Checkbox
                            checked={
                                table.getIsAllPageRowsSelected() ||
                                (table.getIsSomePageRowsSelected() && "indeterminate")
                            }
                            onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
                            aria-label="Select all"
                        />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
                            aria-label="Select row"
                        />
                    </div>
                ),
                enableSorting: false,
                enableHiding: false,
            })
        }

        // Add user columns
        cols.push(...userColumns)

        return cols
    }, [userColumns, enableDragDrop, enableRowSelection])

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data?.map(({ id }) => id) || [],
        [data]
    )

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            globalFilter,
            pagination,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: enableRowSelection,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: handleSearchChange,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: handlePaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        globalFilterFn: (row, columnId, filterValue) => {
            const search = filterValue.toLowerCase()
            const value = row.getValue(columnId)

            // Handle different value types
            if (typeof value === 'string') {
                return value.toLowerCase().includes(search)
            }
            if (typeof value === 'number') {
                return value.toString().includes(search)
            }
            if (typeof value === 'boolean') {
                return (value ? 'active' : 'inactive').includes(search)
            }

            return false
        },
        manualPagination: externalCurrentPage !== undefined, // Use manual pagination when external control is provided
        pageCount: externalTotalPages, // Use external page count when provided
    })

    // Handle data changes
    React.useEffect(() => {
        setData(initialData)
    }, [initialData])

    React.useEffect(() => {
        if (onDataChange) {
            onDataChange(data)
        }
    }, [data, onDataChange])

    // Handle row selection changes
    React.useEffect(() => {
        if (onRowsSelected && enableRowSelection) {
            const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)
            onRowsSelected(selectedRows)
        }
    }, [rowSelection, table, onRowsSelected, enableRowSelection])

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id)
                const newIndex = dataIds.indexOf(over.id)
                return arrayMove(data, oldIndex, newIndex)
            })
        }
    }

    // Define TableContent inside the component properly
    const renderTableContent = () => (
        <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead key={header.id} colSpan={header.colSpan} className="bg-blue-600 text-white py-5">
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                    enableDragDrop ? (
                        <SortableContext
                            items={dataIds}
                            strategy={verticalListSortingStrategy}
                        >
                            {table.getRowModel().rows.map((row) => (
                                <DraggableRow key={row.id} row={row} />
                            ))}
                        </SortableContext>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="py-5">
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-5">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                        >
                            No results.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )

    return (
        <div className="flex flex-col gap-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
                {enableSearch && (
                    <div className="flex-1 max-w-lg relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={globalFilter}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-10"
                            disabled={isLoading}
                        />
                    </div>
                )}
                <div className="flex items-center gap-2">
                    {enableColumnVisibility && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" disabled={isLoading}>
                                    <IconLayoutColumns />
                                    <span className="hidden lg:inline">Customize Columns</span>
                                    <span className="lg:hidden">Columns</span>
                                    <IconChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                {table
                                    .getAllColumns()
                                    .filter(
                                        (column) =>
                                            typeof column.accessorFn !== "undefined" &&
                                            column.getCanHide()
                                    )
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {showAddButton && (
                        <Button variant="outline" size="sm" onClick={onAddClick} disabled={isLoading}>
                            <IconPlus />
                            <span className="hidden lg:inline">{addButtonLabel}</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">Loading...</div>
                </div>
            )}

            {/* Table */}
            {!isLoading && (
                <div className="overflow-hidden rounded-lg border">
                    {enableDragDrop ? (
                        <DndContext
                            collisionDetection={closestCenter}
                            modifiers={[restrictToVerticalAxis]}
                            onDragEnd={handleDragEnd}
                            sensors={sensors}
                            id={sortableId}
                        >
                            {renderTableContent()}
                        </DndContext>
                    ) : (
                        renderTableContent()
                    )}
                </div>
            )}

            {/* Pagination */}
            {enablePagination && !isLoading && (
                <div className="flex items-center justify-between px-4">
                    {/* Show total count when provided */}
                    {totalCount !== undefined && (
                        <div className="text-muted-foreground flex-1 text-sm">
                            Total: {totalCount} items
                        </div>
                    )}
                    {enableRowSelection && totalCount === undefined && (
                        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                            {table.getFilteredSelectedRowModel().rows.length} of{" "}
                            {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div>
                    )}
                    <div className="flex w-full items-center gap-8 lg:w-fit lg:ml-auto">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Rows per page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                                disabled={isLoading}
                            >
                                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                    <SelectValue
                                        placeholder={table.getState().pagination.pageSize}
                                    />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {externalTotalPages || table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage() || isLoading}
                            >
                                <span className="sr-only">Go to first page</span>
                                <IconChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage() || isLoading}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <IconChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage() || isLoading}
                            >
                                <span className="sr-only">Go to next page</span>
                                <IconChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage() || isLoading}
                            >
                                <span className="sr-only">Go to last page</span>
                                <IconChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
