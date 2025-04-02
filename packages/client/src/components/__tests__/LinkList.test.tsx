import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import LinkList from '../LinkList';
import { linksApi } from '../../services/linksApi';

// Mock the linksApi
jest.mock('../../services/linksApi');

describe('LinkList', () => {
  const mockLinks = [
    {
      id: '1',
      url: 'https://example.com',
      title: 'Test Link 1',
      description: 'Test Description 1',
      tags: [],
    },
    {
      id: '2',
      url: 'https://example2.com',
      title: 'Test Link 2',
      description: 'Test Description 2',
      tags: [],
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    render(
      <ChakraProvider>
        <LinkList />
      </ChakraProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render links when data is fetched successfully', async () => {
    (linksApi.getAll as jest.Mock).mockResolvedValueOnce({
      data: {
        links: mockLinks,
        pagination: {
          total: 2,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        },
      },
    });

    render(
      <ChakraProvider>
        <LinkList />
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Link 1')).toBeInTheDocument();
      expect(screen.getByText('Test Link 2')).toBeInTheDocument();
    });
  });

  it('should render error message when fetch fails', async () => {
    (linksApi.getAll as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <ChakraProvider>
        <LinkList />
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch links')).toBeInTheDocument();
    });
  });

  it('should render "No links found" when there are no links', async () => {
    (linksApi.getAll as jest.Mock).mockResolvedValueOnce({
      data: {
        links: [],
        pagination: {
          total: 0,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        },
      },
    });

    render(
      <ChakraProvider>
        <LinkList />
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No links found')).toBeInTheDocument();
    });
  });

  it('should handle pagination', async () => {
    const mockPagination = {
      data: {
        links: mockLinks,
        pagination: {
          total: 4,
          page: 1,
          pageSize: 2,
          totalPages: 2,
        },
      },
    };

    (linksApi.getAll as jest.Mock).mockResolvedValueOnce(mockPagination);

    render(
      <ChakraProvider>
        <LinkList />
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });
}); 