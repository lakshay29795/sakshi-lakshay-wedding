import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GuestBookFilters } from '@/components/guestbook/GuestBookFilters';
import { GuestBookFilters as GuestBookFiltersType } from '@/types/guestbook';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Search: ({ className, ...props }: any) => <div data-testid="search-icon" className={className} {...props} />,
  Filter: ({ className, ...props }: any) => <div data-testid="filter-icon" className={className} {...props} />,
  SortAsc: ({ className, ...props }: any) => <div data-testid="sort-asc-icon" className={className} {...props} />,
  SortDesc: ({ className, ...props }: any) => <div data-testid="sort-desc-icon" className={className} {...props} />,
}));

describe('GuestBookFilters', () => {
  const mockFilters: GuestBookFiltersType = {
    status: 'approved',
    sortBy: 'newest',
    search: '',
  };

  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all filter controls', () => {
    render(<GuestBookFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByPlaceholderText(/search messages/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('approved')).toBeInTheDocument();
    expect(screen.getByDisplayValue('newest')).toBeInTheDocument();
  });

  it('calls onFilterChange when search input changes', async () => {
    const user = userEvent.setup();
    render(<GuestBookFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);

    const searchInput = screen.getByPlaceholderText(/search messages/i);
    await user.type(searchInput, 'congratulations');

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: 'congratulations',
    });
  });

  it('calls onFilterChange when status filter changes', async () => {
    const user = userEvent.setup();
    render(<GuestBookFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);

    const statusSelect = screen.getByDisplayValue('approved');
    await user.selectOptions(statusSelect, 'pending');

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      status: 'pending',
    });
  });

  it('calls onFilterChange when sort option changes', async () => {
    const user = userEvent.setup();
    render(<GuestBookFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);

    const sortSelect = screen.getByDisplayValue('newest');
    await user.selectOptions(sortSelect, 'oldest');

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      sortBy: 'oldest',
    });
  });

  it('displays current search value', () => {
    const filtersWithSearch = { ...mockFilters, search: 'wedding' };
    render(<GuestBookFilters filters={filtersWithSearch} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByDisplayValue('wedding')).toBeInTheDocument();
  });

  it('shows all status options', async () => {
    const user = userEvent.setup();
    render(<GuestBookFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);

    const statusSelect = screen.getByDisplayValue('approved');
    await user.click(statusSelect);

    expect(screen.getByText('All Messages')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('shows all sort options', async () => {
    const user = userEvent.setup();
    render(<GuestBookFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);

    const sortSelect = screen.getByDisplayValue('newest');
    await user.click(sortSelect);

    expect(screen.getByText('Newest First')).toBeInTheDocument();
    expect(screen.getByText('Oldest First')).toBeInTheDocument();
    expect(screen.getByText('Most Liked')).toBeInTheDocument();
  });

  it('clears search when clear button is clicked', async () => {
    const user = userEvent.setup();
    const filtersWithSearch = { ...mockFilters, search: 'test search' };
    render(<GuestBookFilters filters={filtersWithSearch} onFilterChange={mockOnFilterChange} />);

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    await user.click(clearButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: '',
    });
  });

  it('shows clear button only when search has value', () => {
    const { rerender } = render(
      <GuestBookFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />
    );

    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();

    const filtersWithSearch = { ...mockFilters, search: 'test' };
    rerender(<GuestBookFilters filters={filtersWithSearch} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
  });

  it('debounces search input changes', async () => {
    const user = userEvent.setup();
    render(<GuestBookFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);

    const searchInput = screen.getByPlaceholderText(/search messages/i);
    
    // Type multiple characters quickly
    await user.type(searchInput, 'hello');

    // Should not call onFilterChange for each character
    expect(mockOnFilterChange).not.toHaveBeenCalledTimes(5);
  });

  it('handles admin-only filters when showAdminFilters is true', () => {
    render(
      <GuestBookFilters 
        filters={mockFilters} 
        onFilterChange={mockOnFilterChange} 
        showAdminFilters 
      />
    );

    // Should show additional admin options
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('hides admin-only filters by default', () => {
    render(<GuestBookFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);

    // Should not show rejected option for regular users
    const statusSelect = screen.getByDisplayValue('approved');
    expect(statusSelect).not.toHaveTextContent('Rejected');
  });

  it('applies correct styling for active filters', () => {
    const activeFilters = { ...mockFilters, search: 'active search' };
    render(<GuestBookFilters filters={activeFilters} onFilterChange={mockOnFilterChange} />);

    const searchInput = screen.getByDisplayValue('active search');
    expect(searchInput).toHaveClass('border-sage-green');
  });
});
