import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Box, VStack, Text, Button, HStack } from '@chakra-ui/react';
import { Link } from '../services/api';
import { linksApi } from '../services/linksApi';
import LinkListItem from './LinkListItem';

export interface LinkListRef {
  fetchLinks: () => void;
}

const LinkList = forwardRef<LinkListRef>((_, ref) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await linksApi.getAll({ page });
      setLinks(response.data.links);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      console.error('Error fetching links:', err);
      setError('Failed to fetch links');
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchLinks
  }));

  useEffect(() => {
    fetchLinks();
  }, [page]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text color="red.500">{error}</Text>;
  if (links.length === 0) return <Text>No links found</Text>;

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        {links.map((link) => (
          <LinkListItem key={link.id} link={link} onUpdate={fetchLinks} />
        ))}
      </VStack>
      {totalPages > 1 && (
        <HStack justify="center" mt={4}>
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            isDisabled={page === 1}
          >
            Previous
          </Button>
          <Text>
            Page {page} of {totalPages}
          </Text>
          <Button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            isDisabled={page === totalPages}
          >
            Next
          </Button>
        </HStack>
      )}
    </Box>
  );
});

export default LinkList; 