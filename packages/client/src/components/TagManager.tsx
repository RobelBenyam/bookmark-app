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

    setIsLoading(true);
    try {
      const response = await tagsApi.create({ name: newTagName.trim() });
      setTags([...tags, response.data]);
      setNewTagName('');
      toast({
        title: 'Tag created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating tag:', error);
      toast({
        title: 'Error creating tag',
        description: 'Please try again later',
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
      setTags(tags.filter(tag => tag.id !== tagId));
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

  if (isLoading) {
    return <Box>Loading tags...</Box>;
  }

  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <FormControl>
          <FormLabel>Create New Tag</FormLabel>
          <HStack>
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name"
            />
            <Button
              onClick={handleCreateTag}
              isLoading={isLoading}
              colorScheme="blue"
            >
              Create
            </Button>
          </HStack>
        </FormControl>
      </Box>

      <Box>
        <FormLabel>Filter by Tags</FormLabel>
        <HStack spacing={2} wrap="wrap">
          {tags.map((tag) => (
            <ChakraTag
              key={tag.id}
              size="lg"
              borderRadius="full"
              variant={selectedTags.includes(tag.id) ? 'solid' : 'outline'}
              colorScheme={selectedTags.includes(tag.id) ? 'blue' : 'gray'}
              cursor="pointer"
              onClick={() => handleToggleTag(tag.id)}
            >
              <TagLabel>{tag.name}</TagLabel>
              <TagCloseButton onClick={(e) => {
                e.stopPropagation();
                handleDeleteTag(tag.id);
              }} />
            </ChakraTag>
          ))}
        </HStack>
      </Box>
    </VStack>
  );
} 