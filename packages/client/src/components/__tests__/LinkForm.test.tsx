import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { LinkForm } from '../LinkForm';
import { linksApi } from '../../services/linksApi';

// Mock the linksApi
jest.mock('../../services/linksApi');

describe('LinkForm', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should render form fields', () => {
    render(
      <ChakraProvider>
        <LinkForm onSuccess={mockOnSuccess} />
      </ChakraProvider>
    );

    expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add link/i })).toBeInTheDocument();
  });

  it('should show validation errors for required fields', async () => {
    render(
      <ChakraProvider>
        <LinkForm onSuccess={mockOnSuccess} />
      </ChakraProvider>
    );

    const submitButton = screen.getByRole('button', { name: /add link/i });
    await userEvent.click(submitButton);

    expect(screen.getByText(/url is required/i)).toBeInTheDocument();
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('should show validation error for invalid URL', async () => {
    render(
      <ChakraProvider>
        <LinkForm onSuccess={mockOnSuccess} />
      </ChakraProvider>
    );

    const urlInput = screen.getByLabelText(/url/i);
    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /add link/i });

    await userEvent.type(urlInput, 'invalid-url');
    await userEvent.type(titleInput, 'Test Title');
    await userEvent.click(submitButton);

    expect(screen.getByText(/invalid url format/i)).toBeInTheDocument();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('should submit form successfully', async () => {
    const mockResponse = {
      id: '1',
      url: 'https://example.com',
      title: 'Test Link',
      description: 'Test Description',
    };

    (linksApi.create as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(
      <ChakraProvider>
        <LinkForm onSuccess={mockOnSuccess} />
      </ChakraProvider>
    );

    const urlInput = screen.getByLabelText(/url/i);
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /add link/i });

    await userEvent.type(urlInput, 'https://example.com');
    await userEvent.type(titleInput, 'Test Link');
    await userEvent.type(descriptionInput, 'Test Description');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(linksApi.create).toHaveBeenCalledWith({
        url: 'https://example.com',
        title: 'Test Link',
        description: 'Test Description',
        tagIds: [],
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should handle API error', async () => {
    (linksApi.create as jest.Mock).mockRejectedValueOnce(new Error('Failed to create link'));

    render(
      <ChakraProvider>
        <LinkForm onSuccess={mockOnSuccess} />
      </ChakraProvider>
    );

    const urlInput = screen.getByLabelText(/url/i);
    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /add link/i });

    await userEvent.type(urlInput, 'https://example.com');
    await userEvent.type(titleInput, 'Test Link');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/error creating link/i)).toBeInTheDocument();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
}); 