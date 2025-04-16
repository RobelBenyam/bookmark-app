import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Tag as ChakraTag,
  TagLabel,
  TagCloseButton,
  useToast,
  Text,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { Tag, tagsApi } from '../services/api';

interface TagManagerProps {
  selectedTags: string[];
  onChange: (tagIds: string[]) => void;
}

export function TagManager({ selectedTags, onChange }: TagManagerProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTagName, setNewTagName] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const response = await tagsApi.getAll();
      setTags(response.data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        title: 'Error fetching tags',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    const existingTag = tags.find(tag => 
      tag.name.toLowerCase() === newTagName.trim().toLowerCase()
    );

    if (existingTag) {
      toast({
        title: 'Tag already exists',
        description: 'Please choose a different name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await tagsApi.create({ name: newTagName.trim() });
      if (response?.data) {
        setTags(prevTags => [...prevTags, response.data]);
        setNewTagName('');
        toast({
          title: 'Tag created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error('Error creating tag:', error);
      const errorMessage = error.response?.data?.error || 'Please try again later';
      toast({
        title: 'Error creating tag',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      await tagsApi.delete(tagId);
      setTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
      onChange(selectedTags.filter(id => id !== tagId));
      toast({
        title: 'Tag deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        title: 'Error deleting tag',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleToggleTag = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onChange(newSelectedTags);
  };

  if (isLoading && tags.length === 0) {
    return <Box p={4}>Loading tags...</Box>;
  }

  return (
    <VStack spacing={6} align="stretch" width="100%" p={4}>
      <Box>
        <Heading size="sm" mb={2}>Available Tags</Heading>
        <HStack spacing={2} wrap="wrap" minHeight="40px">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <ChakraTag
                key={tag.id}
                size="md"
                borderRadius="full"
                variant={selectedTags.includes(tag.id) ? 'solid' : 'outline'}
                colorScheme={selectedTags.includes(tag.id) ? 'blue' : 'gray'}
                cursor="pointer"
                onClick={() => handleToggleTag(tag.id)}
              >
                <TagLabel>{tag.name}</TagLabel>
                <TagCloseButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTag(tag.id);
                  }} 
                />
              </ChakraTag>
            ))
          ) : (
            <Text color="gray.500">No tags available</Text>
          )}
        </HStack>
      </Box>

      <Divider />

      <Box>
        <form onSubmit={handleCreateTag}>
          <FormControl>
            <FormLabel>Add New Tag</FormLabel>
            <HStack>
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter tag name"
                size="md"
              />
              <Button
                type="submit"
                isLoading={isLoading}
                colorScheme="blue"
                size="md"
              >
                Create
              </Button>
            </HStack>
          </FormControl>
        </form>
      </Box>
    </VStack>
  );
} 