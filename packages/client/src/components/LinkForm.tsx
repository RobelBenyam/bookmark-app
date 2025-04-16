import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
  useColorModeValue,
  Heading,
  InputGroup,
  InputLeftElement,
  Icon,
  FormErrorMessage,
  HStack,
  Tag as ChakraTag,
  TagLabel,
  Text,
  Spinner,
} from '@chakra-ui/react';
import { linksApi, CreateLinkData, Tag, tagsApi } from '../services/api';
import { LinkIcon, ViewIcon, InfoIcon, AddIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';

interface LinkFormProps {
  onSuccess: () => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function LinkForm({ onSuccess, selectedTags, onTagsChange }: LinkFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTagsLoading, setIsTagsLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<CreateLinkData>({
    url: '',
    title: '',
    description: '',
    tagIds: selectedTags,
  });

  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBg = useColorModeValue('white', 'gray.800');
  const inputBorderColor = useColorModeValue('gray.300', 'gray.600');
  const inputHoverBorderColor = useColorModeValue('blue.400', 'blue.300');
  const inputFocusBorderColor = useColorModeValue('blue.500', 'blue.400');

  useEffect(() => {
    if (isAuthenticated) {
      fetchTags();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      tagIds: selectedTags
    }));
  }, [selectedTags]);

  const fetchTags = async () => {
    setIsTagsLoading(true);
    try {
      const response = await tagsApi.getAll();
      console.log('Fetched tags:', response.data);
      setTags(response.data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        title: 'Error fetching tags',
        description: 'Please try refreshing the page',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsTagsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.url) newErrors.url = 'URL is required';
    if (!formData.title) newErrors.title = 'Title is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      await linksApi.create(formData);
      toast({
        title: 'Link created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setFormData({ url: '', title: '', description: '', tagIds: [] });
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error creating link',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleTagToggle = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onTagsChange(newSelectedTags);
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    const existingTag = tags.find(tag => 
      tag.name.toLowerCase() === newTagName.trim().toLowerCase()
    );

    if (existingTag) {
      if (!selectedTags.includes(existingTag.id)) {
        onTagsChange([...selectedTags, existingTag.id]);
        setNewTagName('');
        toast({
          title: 'Tag selected',
          description: 'The existing tag has been selected',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }
      return;
    }

    try {
      const response = await tagsApi.create({ name: newTagName.trim() });
      if (response?.data) {
        setTags(prevTags => [...prevTags, response.data]);
        setNewTagName('');
        onTagsChange([...selectedTags, response.data.id]);
        toast({
          title: 'Tag created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Please try again later';
      toast({
        title: 'Error creating tag',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={4} color="gray.700">Add New Link</Heading>
          <Box 
            bg={bgColor} 
            p={6} 
            borderRadius="lg" 
            borderWidth="1px" 
            borderColor={borderColor}
          >
            <VStack spacing={4}>
              <FormControl isRequired isInvalid={!!errors.url}>
                <FormLabel>URL</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={LinkIcon} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    type="url"
                    size="lg"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputHoverBorderColor }}
                    _focus={{ borderColor: inputFocusBorderColor }}
                    _focusVisible={{ boxShadow: 'none' }}
                  />
                </InputGroup>
                <FormErrorMessage>{errors.url}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.title}>
                <FormLabel>Title</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={ViewIcon} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter title"
                    size="lg"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputHoverBorderColor }}
                    _focus={{ borderColor: inputFocusBorderColor }}
                    _focusVisible={{ boxShadow: 'none' }}
                  />
                </InputGroup>
                <FormErrorMessage>{errors.title}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={InfoIcon} color="gray.400" />
                  </InputLeftElement>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter description (optional)"
                    size="lg"
                    rows={3}
                    bg={inputBg}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputHoverBorderColor }}
                    _focus={{ borderColor: inputFocusBorderColor }}
                    _focusVisible={{ boxShadow: 'none' }}
                    pl={12}
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Tags</FormLabel>
                <HStack spacing={2} mb={2}>
                  <Input
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Enter tag name"
                    size="md"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputHoverBorderColor }}
                    _focus={{ borderColor: inputFocusBorderColor }}
                    _focusVisible={{ boxShadow: 'none' }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateTag(e);
                      }
                    }}
                  />
                  <Button
                    onClick={handleCreateTag}
                    colorScheme="blue"
                    size="md"
                    leftIcon={<AddIcon />}
                    isLoading={isLoading}
                  >
                    Add Tag
                  </Button>
                </HStack>
                {isTagsLoading ? (
                  <HStack spacing={2}>
                    <Spinner size="sm" />
                    <Text>Loading tags...</Text>
                  </HStack>
                ) : (
                  <HStack spacing={2} wrap="wrap" minH="40px">
                    {tags.length > 0 ? (
                      tags.map((tag) => (
                        <ChakraTag
                          key={tag.id}
                          size="md"
                          borderRadius="full"
                          variant={selectedTags.includes(tag.id) ? 'solid' : 'outline'}
                          colorScheme={selectedTags.includes(tag.id) ? 'blue' : 'gray'}
                          cursor="pointer"
                          onClick={() => handleTagToggle(tag.id)}
                        >
                          <TagLabel>{tag.name}</TagLabel>
                        </ChakraTag>
                      ))
                    ) : (
                      <Text color="gray.500">No tags available. Create your first tag above.</Text>
                    )}
                  </HStack>
                )}
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                size="lg"
                w="100%"
                mt={4}
                _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
                _active={{ transform: 'translateY(0)' }}
                transition="all 0.2s"
              >
                Add Link
              </Button>
            </VStack>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
} 