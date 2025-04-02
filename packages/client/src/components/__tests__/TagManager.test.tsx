import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/setup';
import { TagManager } from '../TagManager';
import { tagsApi } from '../../services/api';
import type { Tag } from '../../services/api';

vi.mock('../../services/api', () => ({
  tagsApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('TagManager', () => {
  const mockTags: Tag[] = [
    { id: '1', name: 'Technology', createdAt: '2024-03-20T00:00:00Z' },
    { id: '2', name: 'Programming', createdAt: '2024-03-20T00:00:00Z' },
  ];

  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    vi.clearAllMocks();
  });

  it('renders tag list', async () => {
    vi.mocked(tagsApi.getAll).mockResolvedValue({ data: mockTags });

    render(<TagManager selectedTags={[]} onChange={mockOnChange} />);

    await waitFor(() => {
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('Programming')).toBeInTheDocument();
    });
  });

  it('handles tag selection', async () => {
    vi.mocked(tagsApi.getAll).mockResolvedValue({ data: mockTags });

    render(<TagManager selectedTags={[]} onChange={mockOnChange} />);

    await waitFor(() => {
      const technologyTag = screen.getByText('Technology');
      fireEvent.click(technologyTag);

      expect(mockOnChange).toHaveBeenCalledWith(['1']);
    });
  });

  it('handles tag deselection', async () => {
    vi.mocked(tagsApi.getAll).mockResolvedValue({ data: mockTags });

    render(<TagManager selectedTags={['1']} onChange={mockOnChange} />);

    await waitFor(() => {
      const technologyTag = screen.getByText('Technology');
      fireEvent.click(technologyTag);

      expect(mockOnChange).toHaveBeenCalledWith([]);
    });
  });

  it('creates a new tag', async () => {
    vi.mocked(tagsApi.getAll).mockResolvedValue({ data: mockTags });
    vi.mocked(tagsApi.create).mockResolvedValue({
      data: { id: '3', name: 'New Tag', createdAt: '2024-03-20T00:00:00Z' },
    });

    render(<TagManager selectedTags={[]} onChange={mockOnChange} />);

    const newTagInput = screen.getByPlaceholderText(/add new tag/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(newTagInput, { target: { value: 'New Tag' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(tagsApi.create).toHaveBeenCalledWith({ name: 'New Tag' });
      expect(newTagInput).toHaveValue('');
    });
  });

  it('validates tag name before creation', async () => {
    vi.mocked(tagsApi.getAll).mockResolvedValue({ data: mockTags });

    render(<TagManager selectedTags={[]} onChange={mockOnChange} />);

    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(tagsApi.create).not.toHaveBeenCalled();
      expect(screen.getByText(/tag name is required/i)).toBeInTheDocument();
    });
  });

  it('handles tag deletion', async () => {
    vi.mocked(tagsApi.getAll).mockResolvedValue({ data: mockTags });
    vi.mocked(tagsApi.delete).mockResolvedValue(undefined);

    render(<TagManager selectedTags={[]} onChange={mockOnChange} />);

    await waitFor(() => {
      const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
      fireEvent.click(deleteButton);

      expect(tagsApi.delete).toHaveBeenCalledWith('1');
    });
  });

  it('handles tag update', async () => {
    vi.mocked(tagsApi.getAll).mockResolvedValue({ data: mockTags });
    vi.mocked(tagsApi.update).mockResolvedValue({
      data: { id: '1', name: 'Updated Tag', createdAt: '2024-03-20T00:00:00Z' },
    });

    render(<TagManager selectedTags={[]} onChange={mockOnChange} />);

    await waitFor(() => {
      const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
      fireEvent.click(editButton);

      const editInput = screen.getByDisplayValue('Technology');
      fireEvent.change(editInput, { target: { value: 'Updated Tag' } });
      fireEvent.keyDown(editInput, { key: 'Enter' });

      expect(tagsApi.update).toHaveBeenCalledWith('1', { name: 'Updated Tag' });
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(tagsApi.getAll).mockRejectedValue(new Error('API Error'));

    render(<TagManager selectedTags={[]} onChange={mockOnChange} />);

    await waitFor(() => {
      expect(screen.getByText(/error loading tags/i)).toBeInTheDocument();
    });
  });
}); 