import { ColumnDef } from '@tanstack/react-table';

export type TestData = {
  id: number;
  name: string;
  age: number;
  email: string;
  status: 'active' | 'inactive';
};

export const mockData: TestData[] = [
  { id: 1, name: 'John Doe', age: 30, email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com', status: 'active' },
  { id: 3, name: 'Bob Johnson', age: 45, email: 'bob@example.com', status: 'inactive' },
  { id: 4, name: 'Alice Brown', age: 35, email: 'alice@example.com', status: 'active' },
  { id: 5, name: 'Mark Wilson', age: 28, email: 'mark@example.com', status: 'inactive' },
];

export const mockColumns: ColumnDef<TestData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'age',
    header: 'Age',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: info => (
      <span
        style={{
          color: info.getValue() === 'active' ? 'green' : 'red',
          fontWeight: 'bold',
        }}
      >
        {info.getValue() as string}
      </span>
    ),
  },
];

export const mockMenuItems = [
  {
    text: 'Edit',
    icon: 'edit',
    color: 'primary',
    onClick: () => console.log('Edit clicked'),
  },
  {
    text: 'Delete',
    icon: 'delete',
    color: 'error',
    onClick: () => console.log('Delete clicked'),
  },
  {
    text: 'View Details',
    icon: 'visibility',
    color: 'info',
    onClick: () => console.log('View Details clicked'),
  },
];

export const createMockHandlers = () => ({
  handleRowClick: jest.fn(),
  handlePageChange: jest.fn(),
  handleRowsPerPageChange: jest.fn(),
  handleMenuClose: jest.fn(),
});

export const createTableProps = (overrides = {}) => ({
  data: mockData,
  columns: mockColumns,
  totalItems: 25,
  pageSize: 5,
  page: 1,
  isLoading: false,
  emptyMessage: 'No items available',
  ...createMockHandlers(),
  rowsPerPageOptions: [5, 10, 25],
  anchorEl: null,
  menuItems: mockMenuItems,
  ...overrides,
});
