import { useState } from 'react';
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
} from '@chakra-ui/react';
import { linksApi, CreateLinkData } from '../services/api';
import { TagManager } from './TagManager';
import { LinkIcon, ViewIcon, InfoIcon } from '@chakra-ui/icons';

interface LinkFormProps {
  onSuccess: () => void;
}

export function LinkForm({ onSuccess }: LinkFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const toast = useToast();
  const [formData, setFormData] = useState<CreateLinkData>({
    url: '',
    title: '',
    description: '',
    tagIds: [],
  });

  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBg = useColorModeValue('white', 'gray.800');
  const inputBorderColor = useColorModeValue('gray.300', 'gray.600');
  const inputHoverBorderColor = useColorModeValue('blue.400', 'blue.300');
  const inputFocusBorderColor = useColorModeValue('blue.500', 'blue.400');

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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleTagChange = (tagIds: string[]) => {
    setFormData((prev) => ({ ...prev, tagIds }));
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

              <TagManager
                selectedTags={formData.tagIds || []}
                onChange={handleTagChange}
              />

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