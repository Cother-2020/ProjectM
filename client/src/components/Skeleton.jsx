// Reusable Skeleton Components for Loading States

// Base skeleton element with pulse animation
export function SkeletonBase({ className = '' }) {
    return (
        <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
    );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full border border-white/50 dark:border-gray-700">
            {/* Image placeholder */}
            <div className="h-56 bg-gray-200 dark:bg-gray-700 animate-pulse" />

            <div className="p-5 flex flex-col flex-1">
                {/* Title and price */}
                <div className="flex justify-between items-start mb-2">
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>

                {/* Description lines */}
                <div className="space-y-2 mb-4 flex-1">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>

                {/* Button */}
                <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            </div>
        </div>
    );
}

// Order Card Skeleton
export function OrderCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-l-gray-300 dark:border-l-gray-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1 w-full">
                {/* Order ID and status */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4">
                    <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>

                {/* Total */}
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse border-t pt-2" />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 w-full md:w-auto">
                <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            </div>
        </div>
    );
}

// Menu Manager Card Skeleton
export function MenuItemSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 flex flex-col">
            <div className="flex gap-4 mb-4">
                {/* Image */}
                <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />

                <div className="flex-1 min-w-0">
                    {/* Name and price */}
                    <div className="flex justify-between items-start">
                        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-6 w-14 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                    {/* Description */}
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse" />
                </div>
            </div>

            {/* Category and actions */}
            <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>
            </div>
        </div>
    );
}

// Category Item Skeleton
export function CategoryItemSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex justify-between items-center border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="flex gap-2">
                <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            </div>
        </div>
    );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 4 }) {
    return (
        <tr className="border-b border-gray-100 dark:border-gray-700">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </td>
            ))}
        </tr>
    );
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
    );
}

export default {
    SkeletonBase,
    ProductCardSkeleton,
    OrderCardSkeleton,
    MenuItemSkeleton,
    CategoryItemSkeleton,
    TableRowSkeleton,
    StatsCardSkeleton
};
