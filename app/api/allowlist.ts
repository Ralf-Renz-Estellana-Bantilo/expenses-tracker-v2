export const WRITABLE_TABLES = [
    'expenses',
    'wallet_budget',
    'categories',
    'users',
] as const
export type WritableTable = (typeof WRITABLE_TABLES)[number]

export const isWritableTable = (t: string): t is WritableTable =>
    (WRITABLE_TABLES as readonly string[]).includes(t)

export const SORTABLE_COLUMNS = new Set([
    'ID',
    'categoryID',
    'amount',
    'description',
    'created_on',
    'updated_on',
    'sequence',
    'category',
    'exp.ID',
    'exp.created_on',
])
