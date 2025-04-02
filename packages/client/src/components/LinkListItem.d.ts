import { Link } from '../services/api';

interface LinkListItemProps {
  link: Link;
  onUpdate: () => void;
}

declare const LinkListItem: React.FC<LinkListItemProps>;
export default LinkListItem; 