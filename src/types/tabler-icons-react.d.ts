declare module '@tabler/icons-react' {
  import { FC, SVGProps } from 'react';
  
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    stroke?: number | string;
  }
  
  // List all icons you use
  export const IconDotsVertical: FC<IconProps>;
  export const IconCalendar: FC<IconProps>;
  export const IconClock: FC<IconProps>;
  export const IconSearch: FC<IconProps>;
  export const IconFilter: FC<IconProps>;
  export const IconPlus: FC<IconProps>;
  export const IconChevronDown: FC<IconProps>;
  export const IconChevronLeft: FC<IconProps>;
  export const IconChevronRight: FC<IconProps>;
  export const IconChevronsLeft: FC<IconProps>;
  export const IconChevronsRight: FC<IconProps>;
  export const IconGripVertical: FC<IconProps>;
  export const IconLayoutColumns: FC<IconProps>;
}