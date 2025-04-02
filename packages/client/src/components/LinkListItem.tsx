import { useState } from 'react';
import {
  Box,
  Button,
  HStack,
  Text,
  useToast,
  IconButton,
  Tag,
  TagLabel,
  TagCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Link } from '../services/api';
import { linksApi } from '../services/linksApi';
import { EditLinkModal } from './EditLinkModal';

interface LinkListItemProps {
  link: Link;
  onUpdate: () => void;
}

export default function LinkListItem({ link, onUpdate }: LinkListItemProps) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    try {
      await linksApi.delete(link.id);
      toast({
        title: 'Link deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onUpdate();
    } catch (error) {
      toast({
        title: 'Error deleting link',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      _hover={{ shadow: 'md' }}
      transition="all 0.2s"
    >
      <HStack justify="space-between" align="start">
        <Box flex="1">
          <Text fontWeight="bold" fontSize="lg">
            {link.title}
          </Text>
          <Text color="blue.500" fontSize="sm" mt={1}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.url}
              <ExternalLinkIcon mx="2px" />
            </a>
          </Text>
          {link.description && (
            <Text color="gray.600" fontSize="sm" mt={2}>
              {link.description}
            </Text>
          )}
          {link.tags && link.tags.length > 0 && (
            <HStack mt={2} wrap="wrap" spacing={2}>
              {link.tags.map((tag) => (
                <Tag key={tag.id} size="sm" colorScheme="blue">
                  <TagLabel>{tag.name}</TagLabel>
                </Tag>
              ))}
            </HStack>
          )}
        </Box>
        <HStack spacing={2}>
          <IconButton
            aria-label="Edit link"
            icon={<EditIcon />}
            size="sm"
            onClick={onOpen}
            colorScheme="blue"
            variant="ghost"
          />
          <IconButton
            aria-label="Delete link"
            icon={<DeleteIcon />}
            size="sm"
            onClick={handleDelete}
            colorScheme="red"
            variant="ghost"
          />
        </HStack>
      </HStack>

      <EditLinkModal
        isOpen={isOpen}
        onClose={onClose}
        link={link}
        onSuccess={onUpdate}
      />
    </Box>
  );
} 