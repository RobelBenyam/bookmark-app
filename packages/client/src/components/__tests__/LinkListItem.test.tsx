import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import LinkListItem from '../LinkListItem';
import { linksApi } from '../../services/linksApi';

// Mock the linksApi
jest.mock('../../services/linksApi');

describe('LinkListItem', () => {
  const mockLink = {
    id: '1',
    url: 'https://example.com',
    title: 'Test Link',
    description: 'Test Description',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    tags: [
      { id: '1', name: 'Test Tag', createdAt: '2024-01-01T00:00:00.000Z' },
    ],
  };

  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should render link details', () => {
    render(
      <ChakraProvider>
        <LinkListItem link={mockLink} onUpdate={mockOnUpdate} />
      </ChakraProvider>
    );

    expect(screen.getByText('Test Link')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Tag')).toBeInTheDocument();
  });

  it('should render link without description', () => {
    const linkWithoutDescription = {
      ...mockLink,
      description: undefined,
    };

    render(
      <ChakraProvider>
        <LinkListItem link={linkWithoutDescription} onUpdate={mockOnUpdate} />
      </ChakraProvider>
    );

    expect(screen.getByText('Test Link')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('should render link without tags', () => {
    const linkWithoutTags = {
      ...mockLink,
      tags: [],
    };

    render(
      <ChakraProvider>
        <LinkListItem link={linkWithoutTags} onUpdate={mockOnUpdate} />
      </ChakraProvider>
    );

    expect(screen.getByText('Test Link')).toBeInTheDocument();
    expect(screen.queryByText('Test Tag')).not.toBeInTheDocument();
  });

  it('should handle delete click', async () => {
    (linksApi.delete as jest.Mock).mockResolvedValueOnce(undefined);

    render(
      <ChakraProvider>
        <LinkListItem link={mockLink} onUpdate={mockOnUpdate} />
      </ChakraProvider>
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(linksApi.delete).toHaveBeenCalledWith(mockLink.id);
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it('should handle delete error', async () => {
    (linksApi.delete as jest.Mock).mockRejectedValueOnce(new Error('Failed to delete'));

    render(
      <ChakraProvider>
        <LinkListItem link={mockLink} onUpdate={mockOnUpdate} />
      </ChakraProvider>
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/error deleting link/i)).toBeInTheDocument();
      expect(mockOnUpdate).not.toHaveBeenCalled();
    });
  });

  it('should handle edit click', async () => {
    render(
      <ChakraProvider>
        <LinkListItem link={mockLink} onUpdate={mockOnUpdate} />
      </ChakraProvider>
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    await userEvent.click(editButton);

    expect(screen.getByText(/edit link/i)).toBeInTheDocument();
  });
}); 